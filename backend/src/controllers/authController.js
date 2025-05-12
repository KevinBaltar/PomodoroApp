//backend/src/controllers/authController.js
const User = require("../models/User");
const ConfiguracaoPomodoro = require("../models/ConfiguracaoPomodoro");
const Estatistica = require("../models/Estatistica");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Função para gerar o token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

// Função para criar e enviar o token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Remove a senha do output
  user.senha = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ status: "fail", message: "Nome, email e senha são obrigatórios." });
    }

    const newUser = await User.create({
      nome,
      email,
      senha,
    });

    // Cria configurações padrão e estatísticas para o novo usuário
    const newConfig = await ConfiguracaoPomodoro.create({ usuario_id: newUser._id });
    const newStats = await Estatistica.create({ usuario_id: newUser._id });

    newUser.configuracoes_pomodoro_id = newConfig._id;
    newUser.estatisticas_id = newStats._id;
    await newUser.save({ validateBeforeSave: false }); // Salva as referências sem revalidar a senha

    createSendToken(newUser, 201, req, res);
  } catch (error) {
    // Tratar erros de duplicidade de email, etc.
    if (error.code === 11000) {
        return res.status(400).json({ status: "fail", message: "Este email já está cadastrado." });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro no registro: ", error);
    res.status(500).json({ status: "error", message: "Erro ao registrar usuário." });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // 1) Checar se email e senha existem
    if (!email || !senha) {
      return res.status(400).json({ status: "fail", message: "Por favor, forneça email e senha." });
    }

    // 2) Checar se o usuário existe && senha está correta
    const user = await User.findOne({ email }).select("+senha");

    if (!user || !(await user.compararSenhas(senha, user.senha))) {
      return res.status(401).json({ status: "fail", message: "Email ou senha incorretos." });
    }

    // 3) Se tudo ok, enviar token para o cliente
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error("Erro no login: ", error);
    res.status(500).json({ status: "error", message: "Erro ao fazer login." });
  }
};

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  try {
    // 1) Pegar o token e checar se existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Você não está logado! Por favor, faça login para obter acesso.",
      });
    }

    // 2) Verificar o token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Checar se o usuário ainda existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "O usuário pertencente a este token não existe mais.",
      });
    }

    // GARANTIR ACESSO À ROTA
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ status: "fail", message: "Token inválido. Por favor, faça login novamente." });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ status: "fail", message: "Seu token expirou! Por favor, faça login novamente." });
    }
    console.error("Erro na proteção de rota: ", error);
    res.status(401).json({ status: "fail", message: "Algo deu errado com a autenticação." });
  }
};

