const Pessoa = require("../models/pessoaSchema");
const faker = require('faker');
const mongoose = require('mongoose');

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
      const quantidade = 100000;
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

  // Função assíncrona para atualizar aleatoriamente dados em muitos documentos no MongoDB
  updateManyRandom: async (req, res) => {
    try {
      // Consulta todos os documentos no banco de dados MongoDB
      const documentos = await Pessoa.find({});

      // Define a quantidade desejada de documentos a serem atualizados
      const quantidade = 100000;

      // Gera uma matriz de índices disponíveis para seleção aleatória
      const availableIndices = Array.from({ length: documentos.length }, (_, i) => i);

      // Loop para atualizar documentos até atingir a quantidade desejada ou não haver mais índices disponíveis
      for (let i = 0; i < quantidade && availableIndices.length > 0; i++) {
        // Seleciona aleatoriamente um índice disponível
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];

        // Obtém o documento correspondente ao índice selecionado
        const doc = documentos[selectedIndex];

        try {
          // Atualiza os campos do documento com dados fictícios usando a biblioteca Faker
          doc.nome = faker.name.findName();
          doc.dataNascimento = faker.date.past();
          doc.profissao = faker.name.jobTitle();
          doc.cor = faker.random.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo', 'Indígena']);
          doc.estado = faker.address.state();
          doc.cidade = faker.address.city();

          // Salva as alterações no MongoDB usando o Mongoose
          await doc.save();

          // Loga uma mensagem indicando que o documento foi atualizado com sucesso
          console.log(`Documento com ID ${doc._id} atualizado.`);
        } catch (error) {
          // Loga um erro se houver algum problema ao atualizar o documento
          console.log(`Erro ao atualizar o documento com ID ${doc._id}:`, error);
        }
      }
      // Responde com sucesso após a conclusão da atualização de documentos
      res.status(200).send('Documentos atualizados com sucesso.');
    } catch (err) {
      // Loga um erro se houver algum problema ao buscar os documentos no MongoDB
      console.log('Erro ao buscar documentos:', err);
      res.status(500).send('Erro ao buscar documentos.');
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
  },

  deleteAllData: async (req, res) => {
    try {
      // Consulta para encontrar todos os documentos a serem excluídos
      const query = {};

      // Execute a exclusão em massa
      const result = await Pessoa.deleteMany(query);

      res.json({ message: `${result.deletedCount} pessoas excluídas do MongoDB` });
    } catch (error) {
      console.error('Erro ao excluir dados do MongoDB:', error);
      res.status(500).json({ error: 'Erro ao excluir dados do MongoDB' });
    }
  },

}

module.exports = pessoaController;