"use client";

import { useState } from "react";
import type { Task } from "../pages/dashboard";

export default function TaskList({
  tasks,
  onDelete,
}: {
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>(
    {}
  );

  const toggleExpand = (taskId: number) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (tasks.length === 0)
    return <p className="text-gray-500 text-center">No tasks yet.</p>;

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="p-4 border rounded-lg flex justify-between items-start bg-gray-50 shadow-sm"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            {task.description && (
              <div>
                <p className="text-gray-600 mt-1">
                  {expandedTasks[task.id]
                    ? task.description
                    : task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </p>
                {task.description.length > 100 && (
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="text-blue-500 text-sm mt-1 hover:underline"
                  >
                    {expandedTasks[task.id] ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            title="Delete"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
