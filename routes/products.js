var express = require('express');
var mysql = require('mysql');

var router = express.Router();


/* GET product listing by store. */
router.get('/:id', (req, res) => {
    console.log("Fetching product by storeID :" + req.params.id);

    const queryString = "SELECT * FROM product WHERE store_id = ?";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by storeID " + err);
            res.sendStatus(500);
            return
        }
        console.log("Products fetched by type successfully");
        res.json(rows)
    });
});

/* GET product by id */
router.get('/:idProduct/:idStore', (req, res) => {
    console.log(req.params.idProduct + " " + req.params.idStore);
    const queryString = "SELECT * FROM product WHERE id = ? AND store_id = ?";
    getConnection().query(queryString, [req.params.idProduct, req.params.idStore], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by storeID and productID " + err);
            res.sendStatus(500);
            return
        }
        console.log("Product fetched by storeID and productID successfully");
        res.json(rows)
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