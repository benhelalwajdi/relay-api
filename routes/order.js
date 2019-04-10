var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var router = express.Router();

var reference = generateReference();


/* ADD new order */
router.post('/add_order/', (req, res) => {

    const queryString = "INSERT INTO `order` (id_product, id_store, id_client, reference, date, state, quantity) VALUES (?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.idProduct, req.body.idStore, req.body.idClient, reference,
            new Date(), "WAITING", req.body.quantity],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new order: " + err);
                res.json({status: false, error: err});
            }
            console.log("Inserted a new order with id :" + results.insertId);
            res.json({status: true});
        });
});

/* GET order listing by client */
router.get('/client/:id', (req, res) => {
    console.log("Fetching order by client :" + req.params.id);
    const queryString = "SELECT * FROM `order` WHERE id_client = ?  GROUP BY reference";
    getConnection().query(queryString, [ req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for orders by client " + err);
            res.json({status: false, error: err});
        }
        console.log("Orders fetched by client successfully");
        res.json(rows)
    });
});

/* GET order listing by store */
router.get('/store/:id', (req, res) => {
    console.log("Fetching order by store :" + req.params.id);
    const queryString = "SELECT * FROM `order`  WHERE id_store = ? ";
    getConnection().query(queryString, [ req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for orders by store " + err);
            res.json({status: false, error: err});
        }
        console.log("Orders fetched by store successfully");
        res.json(rows)
    });
});

/* GET order listing by reference */
router.get('/store/reference/:reference', (req, res) => {
    console.log("Fetching order by store :" + req.params.id);
    const queryString = "SELECT * FROM `order` WHERE reference = ?";
    getConnection().query(queryString, [req.params.reference], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for orders by reference " + err);
            res.json({status: false, error: err});
        }
        console.log("Orders fetched by reference successfully");
        res.json(rows)
    });
});

/* GET order listing for stores by state */
router.get('/store/:id/state/:state', (req, res) => {
    console.log("Fetching order for store by state :" + req.params.state);
    const queryString = "SELECT * FROM `order` WHERE id_store = ? AND state = ?";
    getConnection().query(queryString, [req.params.id, req.params.state], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for orders by state " + err);
            res.json({status: false, error: err});
        }
        console.log("Orders fetched by state successfully");
        res.json(rows)
    });
});

/* GET order listing for client by state */
router.get('/client/:id/state/:state', (req, res) => {
    console.log("Fetching order for client by state :" + req.params.state);
    const queryString = "SELECT * FROM `order`   WHERE id_client = ? AND state = ?";
    getConnection().query(queryString, [req.params.id, req.params.state], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for orders by state " + err);
            res.json({status: false, error: err});
        }
        console.log("Orders fetched by state successfully");
        res.json(rows)
    });
});

//TODO : Create the route to change order state.
/* UPDATE order state */

//TODO: Get the reference from sender.
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
