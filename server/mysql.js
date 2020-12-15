let mysql = require("mysql");

let pool = mysql.createPool({
  host: "sql12.freemysqlhosting.net",
  user: "sql12381263",
  password: "EcPY5PHbYZ",
  database: "sql12381263",
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
  let query = "SELECT * FROM tblUsers";
  return handlingQueries(query);
}

function checkUserExists(emailId) {
  let query = `SELECT * FROM tblUsers where EmailId = '${emailId}'`;
  return handlingQueries(query);
}

function checkLoginCredentials(email, password) {
  let query = `SELECT * FROM tblUsers where EmailId = '${email}' and Password = '${password}'`;
  return handlingQueries(query);
}

function addUserInfo(email, userName, password) {
  let query = `INSERT INTO tblUsers (EmailId, UserName, Password) VALUES ('${email}', '${userName}', '${password}')`;
  return handlingQueries(query);
}

function addCategory(category, userId) {
  let query = `INSERT INTO tblCategories (Category, UserId) VALUES ('${category}', '${userId}')`;
  return handlingQueries(query);
}

function fetchCategories(userId) {
  let query = `SELECT * FROM tblCategories where UserId = '${userId}'`;
  return handlingQueries(query);
}

function addBudget(categoryId, userId, budget, month) {
  let query = `INSERT INTO tblBudget(UserId,CategoryId,Budget,Month) VALUES ('${userId}','${categoryId}','${budget}','${month}')`;
  return handlingQueries(query);
}

function fetchBudget(userId) {
  let query = `SELECT * FROM tblBudget where UserId = '${userId}'`;
  return handlingQueries(query);
}

function addExpense(categoryId, userId, expense, month) {
  let query = `INSERT INTO tblExpense(UserId,CategoryId,Expense,Month) VALUES ('${userId}','${categoryId}','${expense}','${month}')`;
  return handlingQueries(query);
}

function fetchExpense(userId) {
  let query = `SELECT * FROM tblExpense where UserId = '${userId}'`;
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
module.exports.addCategory = addCategory;
module.exports.fetchCategories = fetchCategories;
module.exports.fetchBudget = fetchBudget;
module.exports.fetchExpense = fetchExpense;
module.exports.addBudget = addBudget;
module.exports.addExpense = addExpense;
