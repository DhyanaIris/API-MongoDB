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
      const quantidade = 10000;
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

  updateManyRandom: async (req, res) => {
    try {
      // Alterar o valor para atualizar mais ou menos itens no banco
      const quantidade = 10000;
      // Consulta para encontrar documentos a serem atualizados
      const query = { _id: { $exists: true } }; // Isso irá corresponder a qualquer documento com um _id existente
      const result = await Pessoa.find(query).exec();
      if (result && result.length > 0) {
        const updatePromises = [];
        for (let i = 0; i < quantidade; i++) {
          const randomIndex = Math.floor(Math.random() * result.length);
          const randomPerson = result[randomIndex];
          // Gere valores aleatórios usando o Faker para os campos que deseja atualizar
          const update = {
            $set: {
              nome: faker.name.findName(),
              dataNascimento: faker.date.past(),
              profissao: faker.name.jobTitle(),
              cor: faker.random.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo', 'Indígena']),
              estado: faker.address.state(),
              cidade: faker.address.city(),
            },
          };
          // Crie uma promessa para a atualização e adicione-a ao array
          updatePromises.push(Pessoa.updateOne({ _id: randomPerson._id }, update).exec());
        }
        // Aguarde a conclusão de todas as atualizações
        await Promise.all(updatePromises);
        res.json({ message: `${quantidade} pessoas atualizadas no MongoDB` });
      } else {
        res.json({ message: 'Nenhum documento encontrado para atualizar' });
      }
    } catch (error) {
      console.error('Erro ao atualizar pessoas no MongoDB:', error);
      res.status(500).json({ error: 'Erro ao atualizar pessoas no MongoDB' });
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