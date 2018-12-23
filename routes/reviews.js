var express = require('express');
var mysql = require('mysql');
var router = express.Router();


/* Add review to product */

/* Add new review on product */
router.post('/add_review/product', (req, res) => {

    console.log(req.body.rating);
    const queryString = "INSERT INTO product_review (rating, comment, id_product, id_client) VALUES (?,?,?,?)";
    getConnection().query(queryString, [req.body.rating, req.body.comment, req.body.idProduct, req.body.idClient],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new review on product: " + err);
                res.json({status: false, error: err});
            }
            console.log("Inserted a new review on product with id :" + results.insertId);
            res.json({status: true});
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