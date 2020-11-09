//Budget API
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
var budget = require('./Kritika.json');

app.use(cors());

app.get('/budget',cors(), (req, res) => {
    console.log("budget");
res.json(budget);
});


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
}); 




