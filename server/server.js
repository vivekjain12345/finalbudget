//Budget API
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const router = express.Router();
var budget = require("./Kritika.json");
const db = require("./mysql.js");
const jwtHelper = require("./jwt/jwt.js");
const errorHandler = require("./jwt/error-handling.js");

app.use(cors());
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(jwtHelper.jwt());

router.get("/budget", cors(), (req, res) => {
  console.log("budget");
  res.json(budget);
});

router.get("/chartBudget", cors(), (req, res) => {
  db.fetchChartData().then((x) => {
    res.json(x);
  });
});

router.get("/fetchUserInfo", cors(), (req, res) => {
  db.fetchUserInfo().then((x) => {
    res.json(x);
  });
});

router.get("/fetchCategories", cors(), (req, res) => {
  const userId = req.query.userId;
  console.log(userId);
  db.fetchCategories(userId).then((x) => {
    res.json(x);
  });
});

router.post("/addCategory", cors(), (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const category = body.category;
  db.addCategory(category, userId).then((x) => {
    res.json(x);
  });
});

router.get("/fetchBudget", cors(), (req, res) => {
  const userId = req.query.userId;
  db.fetchBudget(userId).then((x) => {
    res.json(x);
  });
});

router.get("/fetchExpense", cors(), (req, res) => {
  const userId = req.query.userId;
  db.fetchExpense(userId).then((x) => {
    res.json(x);
  });
});

router.post("/login", cors(), (req, res) => {
  const body = req.body;
  const email = body.username;
  const pwd = body.password;
  jwtHelper
    .authenticate(email, pwd)
    .then((x) => {
      res.json({
        success: true,
        response: x,
      });
    })
    .catch((x) => {
      res.json({
        success: false,
        response: x,
      });
    });
});

router.post("/register", cors(), (req, res) => {
  const body = req.body;
  const email = body.email;
  const userName = body.userName;
  const pwd = body.pwd;
  db.checkUserExists(email)
    .then((x) => {
      if (x.length === 0) {
        return db.addUserInfo(email, userName, pwd);
      }
      return Promise.reject("Duplicate Users");
    })
    .then((x) => {
      res.json({
        success: true,
        response: x,
      });
    })
    .catch((x) => {
      res.json({
        success: false,
        response: x,
      });
    });
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
app.use(errorHandler);
app.use("/", router);

db.fetchUserInfo().then((x) => {
  console.log(x);
});
