///home/kevin/pomodoro-app/backend/src/models/ConfiguracaoPomodoro.js
const mongoose = require("mongoose");

const configuracaoPomodoroSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tempo_foco: {
    type: Number,
    default: 25,
    min: [1, "O tempo de foco deve ser de pelo menos 1 minuto."],
  },
  tempo_pausa_curta: {
    type: Number,
    default: 5,
    min: [1, "O tempo de pausa curta deve ser de pelo menos 1 minuto."],
  },
  tempo_pausa_longa: {
    type: Number,
    default: 15,
    min: [1, "O tempo de pausa longa deve ser de pelo menos 1 minuto."],
  },
  intervalo_pausa_longa: {
    type: Number,
    default: 4,
    min: [1, "O intervalo para pausa longa deve ser de pelo menos 1 ciclo."],
  },
  notificacoes_sonoras_ativas: {
    type: Boolean,
    default: true,
  },
  notificacoes_push_ativas: {
    type: Boolean,
    default: true,
  },
  tema_aplicativo: {
    type: String,
    enum: ["claro", "escuro", "sistema"],
    default: "sistema",
  },
  ultima_atualizacao: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar 'ultima_atualizacao' antes de salvar
configuracaoPomodoroSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.ultima_atualizacao = Date.now();
  }
  next();
});

const ConfiguracaoPomodoro = mongoose.model(
  "ConfiguracaoPomodoro",
  configuracaoPomodoroSchema
);

module.exports = ConfiguracaoPomodoro;
