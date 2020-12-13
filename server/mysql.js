let mysql = require('mysql');

let pool = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12381263',
  password: 'EcPY5PHbYZ',
  database: 'sql12381263',
  connectionLimit: 5,
});

function disconnect() {
  pool.end(function (err) {
    if (err) {
      return console.log(err.message);
    }
    // close all connections
  });
}

function handlingQueries(query) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      connection.query(query, function (err, result, fields) {
        if (err) {
          reject(err);
        }
        resolve(result);
        connection.release();
      });
    });
  });
}

function fetchUserInfo() {
  let query  = "SELECT * FROM users";
  return handlingQueries(query);
}

function checkUserExists(emailId) {
  let query = `SELECT * FROM users where email = '${emailId}'`
  return handlingQueries(query);
}

function checkLoginCredentials(email, password) {
  let query = `SELECT * FROM users where email = '${email}' and password = '${password}'`
  return handlingQueries(query);
}

function addUserInfo(email,userName,password) {
  let query = `INSERT INTO users (email, username, password) VALUES ('${email}', '${userName}', '${password}')`;
  return handlingQueries(query);
}

function fetchChartData() {
  let query = `SELECT * FROM budgetData`;
  return handlingQueries(query);
}

module.exports.fetchUserInfo = fetchUserInfo;
module.exports.checkUserExists = checkUserExists;
module.exports.addUserInfo = addUserInfo;
module.exports.checkLoginCredentials = checkLoginCredentials;
module.exports.fetchChartData = fetchChartData;