var express = require('express');
var mysql = require('mysql');

var router = express.Router();


/* GET Store listing by id. */
router.get('/:id', (req, res) => {
    console.log("Fetching store by ID :"+ req.params.id);

    const queryString = "SELECT * FROM user WHERE id = ?";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for store by ID " + err);
            res.sendStatus(500);
            return
        }
        console.log("Store fetched by id successfully");
        res.json(rows)
    })
});

/* Get Store By store type */
router.get('/:type', (req, res) => {
    console.log("Fetching stores by type :"+ req.params.type);

    const queryString = "SELECT * FROM user WHERE user_type = ? AND store_type = ?";
    getConnection().query(queryString, ["STORE", req.params.type], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for stores by type " + err);
            res.sendStatus(500);
            return
        }
        console.log("Stores fetched by type successfully");
        res.json(rows)
    })
});

/* get all store */
router.get('/', (req, res) => {
    console.log("Fetching stores");

    const queryString = "SELECT * FROM user WHERE user_type = ?";
    getConnection().query(queryString, "STORE", (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for stores: " + err);
            res.sendStatus(500);
            return
        }
        console.log("Stores fetched successfully");
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
