const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/pessoa', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
      console.log('MongoDB conectado');
    });
  } catch {
    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão com o MongoDB:', err);
    });
  }
}

module.exports = main;
