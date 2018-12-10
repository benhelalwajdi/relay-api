var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var router = express.Router();

var reference = generateReference()


/* Add new order */
router.post('/add_new_order/', (req, res) => {

    const queryString = "INSERT INTO orders (id_product, id_store, id_client, reference, date, state, quantity) VALUES (?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.idProduct, req.body.idStore, req.body.idClient, reference,
            new Date(), "WAITING", req.body.quantity],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new order: " + err);
                res.sendStatus(500);
                return
            }
            console.log("Inserted a new order with id :" + results.insertId);
            res.end();
        });
});

function generateReference(req, response) {
    return reference = crypto.randomBytes(5).toString('hex').toUpperCase();
}
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