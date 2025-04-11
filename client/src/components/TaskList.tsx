// client/src/components/TaskList.tsx
"use client";

import { useState } from "react";
import type { Task } from "../pages/dashboard";
import TaskEdit from "./TaskEdit";
import {
  CheckCircle,
  Circle,
  Clock,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function TaskList({
  tasks,
  onDelete,
  onUpdate,
  onStatusUpdate,
}: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const handleStatusClick = (taskId: string, currentStatus: string) => {
    let newStatus: string;

    switch (currentStatus) {
      case "pending":
        newStatus = "in-progress";
        break;
      case "in-progress":
        newStatus = "completed";
        break;
      case "completed":
        newStatus = "pending";
        break;
      default:
        newStatus = "pending";
    }

    onStatusUpdate(taskId, newStatus);
  };

  if (tasks.length === 0)
    return <p className="text-gray-500 text-center">No tasks yet.</p>;

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="border rounded-lg bg-white shadow-sm overflow-hidden"
        >
          {editingTaskId === task.id ? (
            <TaskEdit
              task={task}
              onSave={(updatedTask) => {
                onUpdate(task.id, updatedTask);
                setEditingTaskId(null);
              }}
              onCancel={() => setEditingTaskId(null)}
            />
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusClick(task.id, task.status)}
                      className="focus:outline-none"
                      title={`Mark as ${getStatusText(task.status)}`}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getStatusText(task.status)}
                    </span>
                    <span>•</span>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>

                  {task.description && (
                    <div className="mt-3">
                      <p className="text-gray-600">
                        {expandedTasks[task.id]
                          ? task.description
                          : task.description.length > 100
                          ? `${task.description.substring(0, 100)}...`
                          : task.description}
                      </p>
                      {task.description.length > 100 && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="mt-1 flex items-center gap-1 text-blue-500 text-sm hover:underline"
                        >
                          {expandedTasks[task.id] ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span>Show less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span>Show more</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTaskId(task.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
