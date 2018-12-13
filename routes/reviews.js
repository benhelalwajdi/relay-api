var express = require('express');
var mysql = require('mysql');
var router = express.Router();


/* Add review to product */

/* Add new review */
router.post('/add_review/', (req, res) => {

    console.log(req.body.rating);
    const queryString = "INSERT INTO review (rating, comment, id_product, id_client) VALUES (?,?,?,?)";
    getConnection().query(queryString, [req.body.rating, req.body.comment, req.body.idProduct, req.body.idClient],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new review on product: " + err);
                res.sendStatus(500);
                return
            }
            console.log("Inserted a new review on product with id :" + results.insertId);
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