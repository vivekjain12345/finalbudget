//Budget API
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const router = express.Router();
var budget = require('./Kritika.json');
const db = require('./mysql.js');


app.use(cors());
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/budget',cors(), (req, res) => {
    console.log("budget");
res.json(budget);
});

router.get('/fetchUserInfo',cors(), (req, res) => {
    db.fetchUserInfo().then(x =>{
        res.json(x);
    });
});

router.post('/register',cors(), (req, res) => {
	const body = req.body;
	const email = body.email;
	const userName = body.username;
	const pwd = body.pwd;
    db.checkUserExists(email).then(x => {
        if(x.length === 0) {
            return db.addUserInfo(email,userName,pwd);
        }
        return Promise.reject('Duplicate Users')
    }).then(x => {
        res.json({
            success: true,
            response: x
        });
    }).catch(x => {
        res.json({
            success: false,
            response: x
        });
    });

    console.log(req.body);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
}); 

app.use("/", router);

db.fetchUserInfo().then(x =>{
    console.log(x);
});



