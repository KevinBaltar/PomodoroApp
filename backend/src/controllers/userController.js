//backend/src/controllers/userController.js
const User = require("../models/User");
const ConfiguracaoPomodoro = require("../models/ConfiguracaoPomodoro");
const Estatistica = require("../models/Estatistica");

// Obter dados do usuário logado (perfil)
exports.getMe = async (req, res, next) => {
  try {
    // req.user é populado pelo middleware authController.protect
    const user = await User.findById(req.user.id)
      .populate("configuracoes_pomodoro_id")
      .populate("estatisticas_id");

    if (!user) {
      return res.status(404).json({ status: "fail", message: "Usuário não encontrado." });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados do usuário: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar dados do usuário." });
  }
};

// Atualizar dados do usuário (nome, email - senha deve ser tratada em rota específica se necessário)
exports.updateMe = async (req, res, next) => {
  try {
    const { nome, email } = req.body;

    // Filtrar campos que não devem ser atualizados por esta rota
    const filteredBody = {};
    if (nome) filteredBody.nome = nome;
    if (email) filteredBody.email = email;

    if (Object.keys(filteredBody).length === 0) {
        return res.status(400).json({ status: "fail", message: "Nenhum dado fornecido para atualização." });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true, // Retorna o documento modificado
      runValidators: true, // Roda as validações do schema
    });

    if (!updatedUser) {
      return res.status(404).json({ status: "fail", message: "Usuário não encontrado para atualização." });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    if (error.code === 11000) { // Erro de duplicidade (ex: email)
        return res.status(400).json({ status: "fail", message: "Este email já está em uso por outro usuário." });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao atualizar dados do usuário: ", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar dados do usuário." });
  }
};

// Obter configurações Pomodoro do usuário
exports.getUserConfigurations = async (req, res, next) => {
  try {
    const config = await ConfiguracaoPomodoro.findOne({ usuario_id: req.user.id });
    if (!config) {
      return res.status(404).json({ status: "fail", message: "Configurações não encontradas para este usuário." });
    }
    res.status(200).json({
      status: "success",
      data: {
        configuracoes: config,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar configurações: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar configurações." });
  }
};

// Atualizar configurações Pomodoro do usuário
exports.updateUserConfigurations = async (req, res, next) => {
  try {
    const { tempo_foco, tempo_pausa_curta, tempo_pausa_longa, intervalo_pausa_longa, notificacoes_sonoras_ativas, notificacoes_push_ativas, tema_aplicativo } = req.body;

    const allowedUpdates = {
        tempo_foco,
        tempo_pausa_curta,
        tempo_pausa_longa,
        intervalo_pausa_longa,
        notificacoes_sonoras_ativas,
        notificacoes_push_ativas,
        tema_aplicativo
    };

    // Remover chaves com valor undefined para não sobrescrever com null/undefined no BD
    Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

    if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ status: "fail", message: "Nenhum dado fornecido para atualização das configurações." });
    }

    const updatedConfig = await ConfiguracaoPomodoro.findOneAndUpdate(
      { usuario_id: req.user.id },
      allowedUpdates,
      {
        new: true,
        runValidators: true,
        upsert: true, // Cria se não existir (embora já deva ser criado no registro)
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        configuracoes: updatedConfig,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao atualizar configurações: ", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar configurações." });
  }
};

// Obter estatísticas do usuário
exports.getUserStatistics = async (req, res, next) => {
    try {
        const stats = await Estatistica.findOne({ usuario_id: req.user.id });
        if (!stats) {
            return res.status(404).json({ status: "fail", message: "Estatísticas não encontradas para este usuário." });
        }
        res.status(200).json({
            status: "success",
            data: {
                estatisticas: stats
            }
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas: ", error);
        res.status(500).json({ status: "error", message: "Erro ao buscar estatísticas." });
    }
};

// Adicione este método ao userController.js
exports.addPushToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Token de notificação é obrigatório"
      });
    }

    // Adiciona o token ao usuário (evitando duplicatas)
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { pushTokens: token } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Token de notificação registrado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao registrar token:", error);
    res.status(500).json({
      status: "error",
      message: "Erro ao registrar token de notificação"
    });
  }
};