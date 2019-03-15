const TesteApi = require('./testeApi');
const errorHandler = require('../common/errorHandler');

// configura servicos rest
TesteApi.methods(['get', 'post', 'put', 'delete']);
// au atualizar, aplica regras de validacao e retorna novo objeto
TesteApi.updateOptions({ new: true, runValidators: true });
// altera o tipo das msgs de erros
TesteApi.after('post', errorHandler).after('put', errorHandler);

// rota para contar o numero de registros
TesteApi.route('count', (req, res, next) => {
  TesteApi.count((error, value) => {
    if (error) {
      res.status(500).json({errors:[error]});
    } else {
      res.json({value});
    }
  })
});

// https://docs.mongodb.com/manual/reference/operator/aggregation/group/
TesteApi.route('summary', (req, res, next) => {
  TesteApi.aggregate([{
    $project: { soma: {$sum: '$tipo1.valor'}, sub: {$sum: '$tipo2.valor' } }
  }, {
    $group: { _id: null, soma: {$sum: '$soma'}, sub: {$sum: '$sub'} }
  }, {
    $project: { _id: 0, soma: 1, sub: 1 }
  }]).exec((error, result) => {
    if (error) {
      res.status(500).json({errors:[error]});
    } else {
      res.json(result[0] || { soma: 0, sub: 0 });
    }
  });
});

TesteApi.route('testere', (req, res, next) => {
  res.json({resTeste: 'resposta de teste'});
});

TesteApi.route('testere2', (req, res, next) => {
  res.json({resTeste: 'resposta de teste 2'});
});

TesteApi.route('testere3', (req, res, next) => {
  res.json({resTeste: 'resposta de teste 3'});
});

module.exports = TesteApi;
