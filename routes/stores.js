var express = require('express');
var mysql = require('mysql');

var router = express.Router();

/* GET stores listing. */
router.get('/', (req, res) => {
    console.log("Fetching stores");

    const queryString = "SELECT * FROM user WHERE user_type = ?";
    getConnection().query(queryString, "STORE", (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for stores: " + err);
            res.json({status: false, error: err});
        }
        console.log("Stores fetched successfully");
        res.json(rows)
    });
});

/* GET stores listing by id */
router.get('/:id', (req, res) => {
    const queryString = "SELECT * FROM user WHERE id = ?";
    getConnection().query(queryString, req.params.id, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for stores by ID: " + err);
            res.json({status: false, error: err});
        }
        console.log("Stores fetched by ID successfully");
        res.json(rows[0]);
    });
});

/* GET stores listing by type. */
router.get('/type/:type', (req, res) => {
    console.log("Fetching stores by type :" + req.params.type);

    const queryString = "SELECT * FROM user WHERE  store_type = ?";
    getConnection().query(queryString, [req.params.type], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for stores by type " + err);
            res.json({status: false, error: err});
        }
        console.log("Stores fetched by type successfully");
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