//backend/src/models/Estatistica.js
const mongoose = require("mongoose");

const estatisticaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Cada usuário tem apenas um documento de estatísticas
    index: true,
  },
  total_pomodoros_foco_concluidos: {
    type: Number,
    default: 0,
  },
  total_minutos_foco: {
    type: Number,
    default: 0,
  },
  media_pomodoros_foco_dia: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0.0,
  },
  sequencia_dias_foco: {
    type: Number,
    default: 0,
  },
  historico_desempenho_diario: [
    {
      data: { type: Date, required: true }, // Dia específico, sem hora
      pomodoros_foco_concluidos: { type: Number, default: 0 },
      minutos_foco: { type: Number, default: 0 },
      tarefas_concluidas_no_dia: { type: Number, default: 0 },
      _id: false, // Não cria _id para subdocumentos
    },
  ],
  historico_desempenho_semanal: [
    {
      ano: { type: Number, required: true },
      semana_do_ano: { type: Number, required: true },
      data_inicio_semana: { type: Date, required: true },
      data_fim_semana: { type: Date, required: true },
      pomodoros_foco_concluidos: { type: Number, default: 0 },
      minutos_foco: { type: Number, default: 0 },
      _id: false,
    },
  ],
  insights_produtividade_ia: [
    {
      texto_insight: String,
      data_geracao: { type: Date, default: Date.now },
      tipo_insight: String, // ex: "padrao_horario", "sugestao_meta"
      _id: false,
    },
  ],
  ultima_atualizacao_estatisticas: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar 'ultima_atualizacao_estatisticas' antes de salvar
estatisticaSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.ultima_atualizacao_estatisticas = Date.now();
  }
  next();
});

// Método para adicionar ou atualizar o desempenho diário
estatisticaSchema.methods.atualizarDesempenhoDiario = function (dataEvento, pomodoros, minutos, tarefasConcluidas) {
  const hoje = new Date(dataEvento);
  hoje.setHours(0, 0, 0, 0); // Normaliza para o início do dia

  let diaExistente = this.historico_desempenho_diario.find(
    (d) => new Date(d.data).getTime() === hoje.getTime()
  );

  if (diaExistente) {
    diaExistente.pomodoros_foco_concluidos += pomodoros;
    diaExistente.minutos_foco += minutos;
    diaExistente.tarefas_concluidas_no_dia += tarefasConcluidas;
  } else {
    this.historico_desempenho_diario.push({
      data: hoje,
      pomodoros_foco_concluidos: pomodoros,
      minutos_foco: minutos,
      tarefas_concluidas_no_dia: tarefasConcluidas,
    });
  }
  // Lógica para recalcular média e sequência de dias pode ser adicionada aqui ou em um serviço separado
};


const Estatistica = mongoose.model("Estatistica", estatisticaSchema);

module.exports = Estatistica;
