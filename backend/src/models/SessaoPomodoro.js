//backend/src/models/SessaoPomodoro.js
const mongoose = require("mongoose");

const sessaoPomodoroSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tarefa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tarefa",
    index: true,
    default: null, // Pode não estar associada a uma tarefa específica
  },
  descricao_tarefa_manual: {
    type: String,
    trim: true,
  },
  data_inicio: {
    type: Date,
    required: true,
    default: Date.now,
  },
  data_fim: {
    type: Date,
  },
  duracao_configurada: {
    // Em minutos
    type: Number,
    required: true,
  },
  duracao_realizada: {
    // Em minutos, calculado ao final da sessão
    type: Number,
    default: 0,
  },
  tipo_sessao: {
    type: String,
    required: true,
    enum: ["foco", "pausa_curta", "pausa_longa"],
  },
  status: {
    type: String,
    required: true,
    enum: ["em_andamento", "concluida", "interrompida", "pulada"],
    default: "em_andamento",
  },
  ciclo_atual_na_sequencia: {
    // Ex: 1 de 4 pomodoros antes da pausa longa
    type: Number,
  },
  anotacoes_durante_sessao: {
    type: String,
    trim: true,
  },
  insights_ia_sessao: [
    {
      texto_insight: String,
      data_geracao: { type: Date, default: Date.now },
      fonte_ia: String, // ex: "OpenAI", "TensorFlow.js_local"
      parametros_usados: mongoose.Schema.Types.Mixed,
    },
  ],
});

sessaoPomodoroSchema.pre("save", function (next) {
  if (this.isModified("status") && (this.status === "concluida" || this.status === "interrompida")) {
    if (!this.data_fim) {
      this.data_fim = Date.now();
    }
    if (this.data_inicio && this.data_fim) {
      const diffMs = this.data_fim - this.data_inicio;
      this.duracao_realizada = Math.round(diffMs / 60000); // Convertendo milissegundos para minutos
    }
  }
  next();
});

const SessaoPomodoro = mongoose.model("SessaoPomodoro", sessaoPomodoroSchema);

module.exports = SessaoPomodoro;
