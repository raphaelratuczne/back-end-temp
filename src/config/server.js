const port = 3003;
// middleware q trata requisicoes
const bodyParser = require('body-parser');
// servidor express
const express = require('express');
const server = express();

// usa bodyParser para interpretar todas as requisições
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
// habilita os cors
const allowCors = require('./cors');
server.use(allowCors);
// corrige erro de int na query
const queryParser = require('express-query-int');
server.use(queryParser());

server.listen(port, function() {
  console.log(`backend esta rodando na porta ${port}`);
});

module.exports = server;
