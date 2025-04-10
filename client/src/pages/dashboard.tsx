/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";

export interface Task {
  id: number;
  title: string;
  description: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      console.log("Fetching tasks...");
      const res = await api.get("/tasks");
      console.log("Tasks response:", res.data);
      setTasks(res.data);
      setError("");
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      if (err.response && err.response.status === 401) {
        // Unauthorized - redirect to login and refresh page
        router.push("/login").then(() => {
          window.location.reload();
        });
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (title: string, description: string) => {
    try {
      await api.post("/tasks", { title, description });
      fetchTasks();
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", err);
    }
  };

  const handleDelete = async (id: number) => {
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
      router.push("/login");
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if logout fails, redirect to login
      router.push("/login");
    }
  };

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

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <TaskList tasks={tasks} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
