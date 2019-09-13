var express = require('express');
var mysql = require('mysql');
var router = express.Router();



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

/* Add review on store */
router.post('/add_review/store', (req, res) => {

    console.log(req.body.rating);
    const queryString = "INSERT INTO store_review (rating, comment, id_store, id_client) VALUES (?,?,?,?)";
    getConnection().query(queryString, [req.body.rating, req.body.comment, req.body.idStore, req.body.idClient],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new review on store: " + err);
                res.json({status: false, error: err});
            }
            console.log("Inserted a new review on store with id :" + results.insertId);
            res.json({status: true});
        });
});


/* GET product review listing*/
router.get('/product/:id', (req, res) => {
   const queryString = "SELECT * FROM product_review WHERE id_product = ?";
   getConnection().query(queryString, [req.params.id], (err, rows)=>{
      if (err){
          console.log("Failed to fetch for reviews on product with ID: " + req.params.id);
          res.json({status: false, error: err});
      }
      console.log("Review on product fetched successfully.");
      res.json(rows)
   });
});

/* GET store review listing*/
router.get('/store/:id', (req, res) => {
    const queryString = "SELECT * FROM store_review WHERE id_store = ?";
    getConnection().query(queryString, [req.params.id], (err, rows)=>{
        if (err){
            console.log("Failed to fetch for reviews on store with ID: " + req.params.id);
            res.json({status: false, error: err});
        }
        console.log("Review on store fetched successfully.");
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
