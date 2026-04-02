import express from "express";
import cors from "cors";
import sql from "./db.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await sql`SELECT * FROM tasks`;
    res.json(tasks);
  } catch (error) {
    console.error("ERRO REAL:", error);
    res.status(500).json({ error: error.message });
  }
});


// Render rodar
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
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