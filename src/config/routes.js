const express = require('express');
const auth = require('./auth');

module.exports = function(server) {
  /*
  * Rotas protegidas por Token JWT
  */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);

  protectedApi.use(auth);

  // rotas de testeApi
  const TesteApi = require('../api/testeApi/testeApiService');
  TesteApi.register(protectedApi, '/teste-api');

  /*
  * Rotas abertas
  */
  const openApi = express.Router();
  server.use('/oapi', openApi);
  const AuthService = require('../api/user/AuthService');
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
  openApi.post('/validateToken', AuthService.validateToken);
  openApi.post('/refreshToken', AuthService.refreshToken);
  openApi.post('/refreshPassword', AuthService.refreshPassword);
  // rotas de testeApi
  TesteApi.register(openApi, '/teste-api');
  const User = AuthService.User;
  User.register(openApi, '/user');
}
