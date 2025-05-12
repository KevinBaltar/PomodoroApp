//backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome é obrigatório."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "O email é obrigatório."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Por favor, forneça um email válido."],
  },
  senha: {
    type: String,
    required: [true, "A senha é obrigatória."],
    minlength: [8, "A senha deve ter pelo menos 8 caracteres."],
    select: false, // Não retorna a senha por padrão nas queries
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  ultima_atualizacao: {
    type: Date,
    default: Date.now,
  },
  // Referências a outras coleções (serão populadas conforme necessário)
  configuracoes_pomodoro_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConfiguracaoPomodoro",
  },
  estatisticas_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Estatistica",
  },
  pushTokens: [{
    type: String,
    select: false // Não retornar tokens nas queries normais
  }],
});

// Middleware para criptografar a senha antes de salvar
userSchema.pre("save", async function (next) {
  // Só roda esta função se a senha foi modificada (ou é nova)
  if (!this.isModified("senha")) return next();

  // Criptografa a senha com custo 12
  this.senha = await bcrypt.hash(this.senha, 12);

  next();
});

// Middleware para atualizar 'ultima_atualizacao' antes de salvar
userSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.ultima_atualizacao = Date.now();
  }
  next();
});

// Método para comparar senhas (para login)
userSchema.methods.compararSenhas = async function (
senhaCandidata,
  senhaUsuario
) {
  return await bcrypt.compare(senhaCandidata, senhaUsuario);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
