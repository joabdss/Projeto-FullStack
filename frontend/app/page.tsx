"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // buscar tarefas
  const fetchTasks = async () => {
    const res = await fetch("http://127.0.0.1:3001/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // criar tarefa
  const createTask = async () => {
  console.log("clicou no botão");

  if (!title) {
    console.log("sem título");
    return;
  }

  try {
    console.log("enviando pro backend...");

    const res = await fetch("http://127.0.0.1:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    console.log("resposta:", data);

    setTitle("");
    fetchTasks();
  } catch (error) {
    console.error("erro:", error);
  }
};

  // deletar tarefa
  const deleteTask = async (id: number) => {
    await fetch(`http://127.0.0.1:3001/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  // marcar como concluída
  const toggleTask = async (id: number, done: boolean) => {
    await fetch(`http://127.0.0.1:3001/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: !done }),
    });

    fetchTasks();
  };

  return (
  <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg">

      <h1 className="text-2xl font-bold mb-4 text-center">
        📚 Minhas tarefas
      </h1>

      {/* input */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-700 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nova tarefa..."
        />
        <button
          onClick={createTask}
          className="bg-blue-500 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          +
        </button>
      </div>

      {/* lista */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
          >
            <span
              className={`flex-1 ${
                task.done ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id, task.done)}
                className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
              >
                ✔
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  </main>
);
}