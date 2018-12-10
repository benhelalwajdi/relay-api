var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var router = express.Router();


/* Add new order */
router.get('/add_new_order/:idProduct/:idStore/:idClient', (req, res) => {

    const queryString = "INSERT INTO orders (id_product, id_store, id_client, reference, date, state) VALUES (?,?,?,?,?,?)";

    var reference = crypto.randomBytes(5).toString('hex').toUpperCase();
    console.log(reference);

    getConnection().query(queryString, [req.params.idProduct, req.params.idStore, req.params.idClient, reference,
            new Date(), "WAITING"],
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