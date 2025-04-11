// client/src/pages/dashboard.tsx
/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { LogOut, Filter, SortAsc, SortDesc } from "lucide-react";
import { useRouter } from "next/router";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);

  // Sorting and filtering state
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Check authentication on mount and when navigating back
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to check if user is authenticated
        await api.get("/check-auth");
        setIsAuthenticated(true);
      } catch (err) {
        console.log("Not authenticated, redirecting to login");
        setIsAuthenticated(false);
        router.replace("/login"); // Use replace instead of push to prevent back navigation
      }
    };

    // Add event listener for when user navigates with browser buttons
    window.addEventListener("popstate", checkAuth);

    // Check auth on initial load
    checkAuth();

    // Cleanup
    return () => {
      window.removeEventListener("popstate", checkAuth);
    };
  }, [router]);

  const fetchTasks = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      console.log("Fetching tasks...");

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (sortBy) {
        params.append("sortBy", sortBy);
      }

      if (status) {
        params.append("status", status);
      }

      if (search) {
        params.append("search", search);
      }

      const res = await api.get(`/tasks?${params.toString()}`);
      console.log("Tasks response:", res.data);
      setTasks(res.data.tasks || res.data);

      // Set total count if available
      if (res.data.pagination) {
        setTotalTasks(res.data.pagination.total);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      if (err.response && err.response.status === 401) {
        // Unauthorized - redirect to login
        setIsAuthenticated(false);
        router.replace("/login");
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, page, limit, sortBy, status, search]);

  const handleAdd = async (title: string, description: string) => {
    try {
      await api.post("/tasks", { title, description });
      fetchTasks();
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", err);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Task>) => {
    try {
      await api.put(`/tasks/${id}`, data);
      fetchTasks();
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      console.error("Error updating task status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setIsAuthenticated(false);
      router.replace("/login"); // Use replace instead of push
    } catch (err) {
      console.error("Error during logout:", err);
      router.replace("/login");
    }
  };

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
            <button
              className="ml-2 text-red-800 font-medium"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        <TaskForm onAdd={handleAdd} />

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="createdAt:desc">Newest First</option>
                    <option value="createdAt:asc">Oldest First</option>
                    <option value="title:asc">Title (A-Z)</option>
                    <option value="title:desc">Title (Z-A)</option>
                  </select>
                  {sortBy.includes(":desc") ? (
                    <SortDesc className="w-5 h-5 text-gray-500" />
                  ) : (
                    <SortAsc className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="limit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Items Per Page
                </label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Reset to first page when changing limit
                  }}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setSortBy("createdAt:desc");
                  setPage(1);
                }}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onStatusUpdate={handleStatusUpdate}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Previous
                </button>

                <div className="text-gray-600">
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
