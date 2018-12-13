var express = require('express');
var mysql = require('mysql');

var router = express.Router();

/* GET clients listing. */
router.get('/', (req, res) => {
    console.log("Fetching clients");

    const queryString = "SELECT * FROM user WHERE user_type = ?";
    getConnection().query(queryString, "CLIENT", (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for  client: " + err);
            res.sendStatus(500);
            return
        }
        console.log("Users fetched successfully");
        res.json(rows)
    })
});

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Relay',
    port: '8889',
    connectionLimit: 10
});

function getConnection() {
    return pool;
}

module.exports = router;