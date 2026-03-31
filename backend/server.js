import express from "express";
import cors from "cors";
import sql from "./db.js";


const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.get("/tasks", async (req, res) => {
  const tasks = await sql`SELECT * FROM tasks`;
  res.json(tasks);
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

// POST
app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  const result = await sql`
    INSERT INTO tasks (title)
    VALUES (${title})
    RETURNING *
  `;

  res.json(result[0]);
});

// UPDATE 
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  const result = await sql`
    UPDATE tasks
    SET done = ${done}
    WHERE id = ${id}
    RETURNING *
  `;

  res.json(result[0]);
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  await sql`DELETE FROM tasks WHERE id = ${id}`;

  res.json({ message: "Tarefa deletada com sucesso" });
});