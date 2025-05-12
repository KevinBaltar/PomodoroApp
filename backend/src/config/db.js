//backend/src/config/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Para carregar variáveis de ambiente do arquivo .env

const connectDB = async () => {
  try {
    // A URI de conexão deve vir de uma variável de ambiente para segurança e flexibilidade
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("ERRO: MONGO_URI não definida nas variáveis de ambiente.");
      process.exit(1); // Sai do processo com falha
    }

    await mongoose.connect(mongoURI, {
      // Opções do Mongoose para evitar warnings de depreciação e melhorar a conexão
      // As opções abaixo são comuns, mas verifique a documentação do Mongoose para as versões mais recentes
      // useNewUrlParser: true, // Deprecated a partir do Mongoose 6
      // useUnifiedTopology: true, // Deprecated a partir do Mongoose 6
      // useCreateIndex: true, // Não é mais necessário a partir do Mongoose 6
      // useFindAndModify: false, // Não é mais necessário a partir do Mongoose 6
    });

    console.log("MongoDB Conectado com Sucesso!");

    // Opcional: Lidar com eventos de conexão
    mongoose.connection.on("error", (err) => {
      console.error(`Erro na conexão com MongoDB: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB Desconectado.");
    });

  } catch (error) {
    console.error(`Erro ao conectar com MongoDB: ${error.message}`);
    // Sair do processo com falha se a conexão inicial falhar
    process.exit(1);
  }
};

module.exports = connectDB;

