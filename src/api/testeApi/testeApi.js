const restful = require('node-restful');
const mongoose = restful.mongoose;

// schemas
const tipo1 = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, min: 0, max: 100, required: true }
});

const tipo2 = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, min: 0, max: 100, required: true },
  status: { type: String, required: false, uppercase: true, enum: ['ATIVO','INATIVO'] }
});

const tipo3 = new mongoose.Schema({
  nome: { type: String, required: [true, 'Nome é obrigatorio'] },
  mes: { type: Number, min: 1, max: 12, required: true },
  tipo1: [tipo1],
  tipo2: [tipo2]
});

module.exports = restful.model('TesteApi', tipo3);
