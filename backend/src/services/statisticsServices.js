const Estatistica = require('../models/Estatistica');
const SessaoPomodoro = require('../models/SessaoPomodoro');

exports.updateStatistics = async (userId) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  
  // Agregações MongoDB
  const dailyStats = await SessaoPomodoro.aggregate([
    { $match: { usuario_id: userId, status: "concluida" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$data_inicio" } },
        totalPomodoros: { $sum: 1 },
        totalMinutes: { $sum: "$duracao_realizada" }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  const weeklyStats = await SessaoPomodoro.aggregate([
    { 
      $match: { 
        usuario_id: userId, 
        data_inicio: { $gte: startOfWeek },
        status: "concluida" 
      } 
    },
    {
      $group: {
        _id: { $week: "$data_inicio" },
        totalPomodoros: { $sum: 1 },
        totalMinutes: { $sum: "$duracao_realizada" }
      }
    }
  ]);

  await Estatistica.findOneAndUpdate(
    { usuario_id: userId },
    {
      $set: {
        historico_desempenho_diario: dailyStats,
        historico_desempenho_semanal: weeklyStats,
        ultima_atualizacao_estatisticas: new Date()
      }
    },
    { new: true, upsert: true }
  );
};