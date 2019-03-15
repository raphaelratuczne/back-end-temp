// conexao com o banco
const mongoose = require('mongoose');
// atribui api de promises do node para o mongoose
mongoose.Promise = global.Promise;

module.exports = mongoose.connect('mongodb://localhost/my-backend', { useMongoClient: true });

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatorio";
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite minimo de '{MIN}'";
mongoose.Error.messages.Number.max = "O '{VALUE}' informado é maior que o limite maximo de '{MAX}'";
mongoose.Error.messages.String.enum = "'{VALUE}' não é valido para o atributo '{PATH}'";
