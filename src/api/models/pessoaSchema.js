const mongoose = require('mongoose');

const pessoaSchema = new mongoose.Schema({
    nome: String,
    dataNascimento: String,
    profissao: String,
    cor: String,
    estado: String,
    cidade: String
  });
  
// // Adicione um índice ao campo 'nome'
// pessoaSchema.index({ nome: 1 });
// console.log("Indice criado")

const Pessoa = mongoose.model('Pessoa', pessoaSchema);

module.exports = Pessoa;