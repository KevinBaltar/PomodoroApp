//backend/src/models/Tarefa.js
const mongoose = require("mongoose");

const tarefaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  titulo: {
    type: String,
    required: [true, "O título da tarefa é obrigatório."],
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  data_prazo: {
    type: Date,
  },
  data_conclusao: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    enum: ["pendente", "em_andamento", "concluida", "cancelada", "arquivada"],
    default: "pendente",
  },
  prioridade: {
    type: String,
    enum: ["baixa", "media", "alta"],
    default: "media",
  },
  pomodoros_estimados: {
    type: Number,
    min: 0,
  },
  pomodoros_realizados: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  ultima_atualizacao: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar 'ultima_atualizacao' antes de salvar
tarefaSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.ultima_atualizacao = Date.now();
  }
  next();
});

const Tarefa = mongoose.model("Tarefa", tarefaSchema);

module.exports = Tarefa;
