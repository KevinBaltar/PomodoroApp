const mongoose = require('mongoose');

module.exports = async () => {
  // Limpeza global após todos os testes
  await mongoose.disconnect();
};