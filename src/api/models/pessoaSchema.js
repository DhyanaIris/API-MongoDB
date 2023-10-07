const mongoose = require('mongoose');

const pessoaSchema = new mongoose.Schema({
    nome: String,
    dataNascimento: String,
    profissao: String,
    cor: String,
    estado: String,
    cidade: String
  });
  
const Pessoa = mongoose.model('Pessoa', pessoaSchema);

module.exports = Pessoa;