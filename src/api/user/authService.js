const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./user');
User.methods(['get']);
const env = require('../../.env');

const emailRegex = /\S+@\S+\.\S+/;

const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;
const passwordRegex2 = /((?=.*\d).{6,20})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => errors.push(error.message));
  return res.status(400).json({errors});
};


const login = (req, res, next) => {
  const email = req.body.email || '';
  const password = req.body.password || '';

  User.findOne({email}, (err, user) => {
    if(err) {
      return sendErrorsFromDB(res, err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(user.toJSON(), env.authSecret, {
        expiresIn: '1 day'
        // expiresIn: '10 seconds'
      });
      const refreshToken = jwt.sign(user.toJSON(), token, {
        expiresIn: '2 day'
        // expiresIn: '30 seconds'
      });
      const { name, email } = user;
      return res.json({ name, email, token, refreshToken });
    } else {
      return res.status(400).send({errors: ['Usuário/Senha inválidos']});
    }
  });
};


const validateToken = (req, res, next) => {
  const token = req.body.token || '';
  jwt.verify(token, env.authSecret, function(err, decoded) {
    return res.status(200).send({valid: !err});
  });
};


const refreshToken = (req, res, next) => {
  const token = req.body.token || '';
  const refreshToken = req.body.refreshToken || '';
  jwt.verify(refreshToken, token, function(err, decoded) {
    if (err) {
      return res.status(403).send({errors: ['RefreshToken invalid.']});
    }
    delete decoded.iat;
    delete decoded.exp;
    const newToken = jwt.sign(decoded, env.authSecret, {
      expiresIn: '1 day'
      // expiresIn: '10 seconds'
    });
    const newRefreshToken = jwt.sign(decoded, newToken, {
      expiresIn: '2 day'
      // expiresIn: '30 seconds'
    });
    return res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  });
};


const signup = (req, res, next) => {
  const name = req.body.name || '';
  const email = req.body.email || '';
  const password = req.body.password || '';
  const confirmPassword = req.body.confirmPassword || '';

  if(!email.match(emailRegex)) {
    return res.status(400).send({errors: ['O e-mail informa está inválido']});
  }

  // if(!password.match(passwordRegex)) {
  //   return res.status(400).send({errors: ["Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20."]});
  // }
  if(!password.match(passwordRegex2)) {
    return res.status(400).send({errors: ["Senha precisar ter tamanho entre 6-20."]});
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);
  // if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
    if (password !=  confirmPassword) {
    return res.status(400).send({errors: ['Senhas não conferem.']});
  }

  User.findOne({email}, (err, user) => {
    if(err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).send({errors: ['Usuário já cadastrado.']});
    } else {
      const newUser = new User({ name, email, password: passwordHash });
      newUser.save(err => {
        if(err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      });
    }
  });
}

const refreshPassword = (req, res, next) => {
  const email = req.body.email || '';

  if(!email.match(emailRegex)) {
    return res.status(400).send({errors: ['O e-mail informa está inválido']});
  }

  const salt = bcrypt.genSaltSync();
  const newPass = String(Math.random()).substr(3,8);
  const passwordHash = bcrypt.hashSync(newPass, salt);

  User.findOneAndUpdate({email}, {password: passwordHash}, (err, user) => {
    if(err) {
      return sendErrorsFromDB(res, err);
    } else if (!user) {
      return res.status(400).send({errors: ['Usuário não cadastrado.']});
    } else {
      return res.status(200).json({ newPass });
    }
  });
}

module.exports = { login, signup, validateToken, refreshToken, refreshPassword, User };
