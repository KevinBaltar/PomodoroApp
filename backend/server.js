//backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar rotas
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
// const statisticsRoutes = require("./src/routes/statisticsRoutes"); // Ainda não criado, mas planejado

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pomodoro_app_dev";

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB conectado com sucesso!"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));
}

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);
// app.use("/api/statistics", statisticsRoutes);

app.get("/api", (req, res) => {
  res.send("API do Pomodoro App está funcionando!");
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app; // Exporte o app para os testes

