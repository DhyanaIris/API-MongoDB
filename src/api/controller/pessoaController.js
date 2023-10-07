const Pessoa = require("../models/pessoaSchema");
const faker = require('faker');

const pessoaController = {
  // Cria um novo item Pessoa
  createPessoa: async (req, res) => {
    try {
      const pessoa = {
        nome: req.body.nome,
        dataNascimento: req.body.dataNascimento,
        profissao: req.body.profissao,
        cor: req.body.cor,
        estado: req.body.estado,
        cidade: req.body.cidade
      }
      const response = await Pessoa.create(pessoa);
      res.status(201).json({ response, msg: 'Pessoa criada com sucesso' });
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      res.status(500).json({ error: 'Erro ao criar pessoa' });
    }
  },

  createManyRandom: async (req, res) => {
    try {
      // Alterar o valor para inserção de mais ou menos itens no banco
      const quantidade = 1000; 
      const randomPessoas = [];

      for (let i = 0; i < quantidade; i++) {
        const pessoa = {
          nome: faker.name.findName(),
          dataNascimento: faker.date.past(),
          profissao: faker.name.jobTitle(),
          cor: faker.random.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo', 'Indígena']),
          estado: faker.address.state(),
          cidade: faker.address.city(),
        };
        randomPessoas.push(pessoa);
      }

      const result = await Pessoa.insertMany(randomPessoas);
      res.json({ message: `${result.insertedCount} pessoas inseridas no MongoDB` });
    } catch (error) {
      console.error('Erro ao inserir pessoas no MongoDB:', error);
      res.status(500).json({ error: 'Erro ao inserir pessoas no MongoDB' });
    }
  },

  getAll: async (req, res) => {
    try {
      const pessoas = await Pessoa.find({});
      res.json(pessoas);
    } catch (error) {
      console.error('Erro ao listar pessoas:', error);
      res.status(500).json({ error: 'Erro ao listar pessoas' });
    }
  },

  getOne: async (req, res) => {
    const id = req.params.id;
    try {
      const pessoa = await Pessoa.findById(id);
      if (!pessoa) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      res.json(pessoa);
    } catch (error) {
      console.error('Erro ao obter pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao obter pessoa por ID' });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    try {
      const pessoa = {
        nome: req.body.nome,
        dataNascimento: req.body.dataNascimento,
        profissao: req.body.profissao,
        cor: req.body.cor,
        estado: req.body.estado,
        cidade: req.body.cidade
      }
      const updatedPessoa = await Pessoa.findByIdAndUpdate(id, pessoa);
      if (!updatedPessoa) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      res.status(200).json({ pessoa, msg: "Pessoa atualizada com sucesso!" });
    } catch (error) {
      console.error('Erro ao atualizar pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao atualizar pessoa por ID' });
    }
  },

  delete: async (req, res) => {
    const id = req.params.id;
    try {
      const deletedPessoa = await Pessoa.findByIdAndDelete(id);
      if (!deletedPessoa) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      res.status(200).json({ deletedPessoa, msg: "Pessoa excluida com sucesso!" });
    } catch (error) {
      console.error('Erro ao excluir pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao excluir pessoa por ID' });
    }
  }
}

module.exports = pessoaController;