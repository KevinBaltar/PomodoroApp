const mongoose = require('mongoose');

module.exports = async () => {
  process.env.NODE_ENV = 'test';
  
  // Configuração global antes de todos os testes
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/pomodoro_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
    });
  }
};