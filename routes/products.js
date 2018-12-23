var express = require('express');
var mysql = require('mysql');

var router = express.Router();

/* Get product listing */
router.get('/', (req, res) => {
    console.log("Fetching product :" + req.params.id);

    const queryString = "SELECT * FROM product order by date desc";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for products " + err);
            res.sendStatus(500);
            return
        }
        console.log("Products fetched successfully");
        res.json(rows)
    });
});

/* GET product by id */
router.get('/:id', (req, res) => {
    const queryString = "SELECT * FROM product WHERE id = ?";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by ID" + err);
            res.json({status: false, error: err});
        }
        console.log("Product fetched by ID successfully");
        res.json(rows[0])
    });
});


/* GET product listing by store. */
router.get('/store/:id', (req, res) => {
    console.log("Fetching product by storeID :" + req.params.id);

    const queryString = "SELECT * FROM product WHERE store_id = ?";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by storeID " + err);
            res.json({status: false, error: err});
            return
        }
        console.log("Products fetched by type successfully");
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