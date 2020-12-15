const expressJwt = require('express-jwt');
const db = require('../mysql.js');
const jwt = require('jsonwebtoken');

const config = {
  "secret": "RANDOM STRING ANYTHING WILL WORK"
}

function jwtMiddleware() {
    const { secret } = config;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
      path: ['/register', '/login', '/budget']
  });
}

function omitPassword(user) {
  const { Password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function authenticate(email, password) {
  return db.checkLoginCredentials(email, password).then(user => {
    if(user.length === 0) {
      return Promise.reject(`Combination of Username & password do not match`);
    }
    const token = jwt.sign({ sub: user[0].email }, config.secret, { expiresIn: '150000' });
    return Promise.resolve({...omitPassword(user[0]), token})
  });
}

module.exports.authenticate = authenticate;
module.exports.jwt = jwtMiddleware;