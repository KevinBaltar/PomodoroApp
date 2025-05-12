//backend/src/controllers/sessionController.js
const SessaoPomodoro = require("../models/SessaoPomodoro");
const Tarefa = require("../models/Tarefa");
const Estatistica = require("../models/Estatistica");

// Iniciar uma nova sessão Pomodoro
exports.createSession = async (req, res, next) => {
  try {
    const {
      tarefa_id,
      descricao_tarefa_manual,
      duracao_configurada,
      tipo_sessao,
      ciclo_atual_na_sequencia,
    } = req.body;

    if (!duracao_configurada || !tipo_sessao) {
      return res.status(400).json({
        status: "fail",
        message: "Duração configurada e tipo de sessão são obrigatórios.",
      });
    }

    const newSession = await SessaoPomodoro.create({
      usuario_id: req.user.id,
      tarefa_id: tarefa_id || null,
      descricao_tarefa_manual,
      duracao_configurada,
      tipo_sessao,
      ciclo_atual_na_sequencia,
      status: "em_andamento", // Sempre inicia em andamento
      data_inicio: Date.now(),
    });

    res.status(201).json({
      status: "success",
      data: {
        sessao: newSession,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao criar sessão: ", error);
    res.status(500).json({ status: "error", message: "Erro ao criar sessão Pomodoro." });
  }
};

// Obter todas as sessões do usuário logado
exports.getAllSessions = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);

    queryObj.usuario_id = req.user.id;

    let query = SessaoPomodoro.find(queryObj).populate("tarefa_id", "titulo"); // Popula o título da tarefa

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort("-data_inicio"); // Padrão: mais recentes primeiro
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const sessions = await query;

    res.status(200).json({
      status: "success",
      results: sessions.length,
      data: {
        sessoes: sessions,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar sessões: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar sessões Pomodoro." });
  }
};

// Obter uma sessão específica pelo ID
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await SessaoPomodoro.findOne({
      _id: req.params.sessionId,
      usuario_id: req.user.id,
    }).populate("tarefa_id", "titulo status");

    if (!session) {
      return res.status(404).json({ status: "fail", message: "Sessão Pomodoro não encontrada." });
    }

    res.status(200).json({
      status: "success",
      data: {
        sessao: session,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar sessão por ID: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar sessão Pomodoro." });
  }
};

// Atualizar uma sessão (ex: concluir, interromper, adicionar anotações)
exports.updateSession = async (req, res, next) => {
  try {
    const { status, anotacoes_durante_sessao } = req.body;

    const allowedUpdates = {};
    if (status) allowedUpdates.status = status;
    if (anotacoes_durante_sessao) allowedUpdates.anotacoes_durante_sessao = anotacoes_durante_sessao;

    // Se a sessão está sendo concluída ou interrompida, registra data_fim e calcula duracao_realizada
    if (status === "concluida" || status === "interrompida") {
      allowedUpdates.data_fim = Date.now();
    }

    if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ status: "fail", message: "Nenhum dado fornecido para atualização da sessão." });
    }

    const session = await SessaoPomodoro.findOne({
        _id: req.params.sessionId,
        usuario_id: req.user.id
    });

    if (!session) {
        return res.status(404).json({ status: "fail", message: "Sessão não encontrada para atualização." });
    }

    // Atualiza os campos permitidos
    Object.assign(session, allowedUpdates);
    
    // O hook pre('save') no modelo SessaoPomodoro irá calcular duracao_realizada
    const updatedSession = await session.save();

    // Se a sessão de foco foi concluída, atualizar estatísticas e tarefa
    if (updatedSession.tipo_sessao === "foco" && updatedSession.status === "concluida") {
      // Atualizar estatísticas do usuário
      const stats = await Estatistica.findOne({ usuario_id: req.user.id });
      if (stats) {
        stats.total_pomodoros_foco_concluidos += 1;
        stats.total_minutos_foco += updatedSession.duracao_realizada;
        // Chamar método para atualizar desempenho diário
        stats.atualizarDesempenhoDiario(updatedSession.data_fim, 1, updatedSession.duracao_realizada, 0);
        await stats.save();
      }

      // Atualizar pomodoros realizados na tarefa, se associada
      if (updatedSession.tarefa_id) {
        await Tarefa.findByIdAndUpdate(updatedSession.tarefa_id, {
          $inc: { pomodoros_realizados: 1 },
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        sessao: updatedSession,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao atualizar sessão: ", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar sessão Pomodoro." });
  }
};

// Adicionar método para estatísticas rápidas
exports.getSessionStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await SessaoPomodoro.aggregate([
      {
        $match: {
          usuario_id: req.user.id,
          data_inicio: { $gte: today },
          status: "concluida"
        }
      },
      {
        $group: {
          _id: null,
          totalSessoes: { $sum: 1 },
          totalMinutos: { $sum: "$duracao_realizada" }
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        sessoesHoje: stats[0]?.totalSessoes || 0,
        minutosHoje: stats[0]?.totalMinutos || 0
      }
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de sessão:", error);
    res.status(500).json({ 
      status: "error",
      message: "Erro ao buscar estatísticas"
    });
  }
};
