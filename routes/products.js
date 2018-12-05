var express = require('express');
var mysql = require('mysql');

var router = express.Router();


/* GET product listing by store. */
router.get('/:id', (req, res) => {
    console.log("Fetching product by storeID :"+ req.params.id);

    const queryString = "SELECT * FROM product WHERE store_id = ?";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by storeID " + err);
            res.sendStatus(500);
            return
        }
        console.log("Products fetched by type successfully");
        res.json(rows)
    })
});

/*Add Product by Store*/
//id	name	description	price	quantity	image	size	store_id
router.get('/:name/:description/:price/:quantity/:image/:size/:store_id', (req, res)=>{
    console.log("Add product to the storeID : "+ req.params.store_id);
    console.log("Product with name : "+ req.params.name +" , description : "+ req.params.description +" , price : "+req.params.price+ " , quantity :" + req.params.quality + " , image : " + req.params.image +  " and size :" + req.params.size + " ,");
    const queryString = "INSERT INTO product (name, description, price, quantity, image, size, store_id) value (?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.params.name, req.params.description, req.params.price, req.params.quantity,
        req.params.image, req.params.size, req.params.store_id ],(err, results, fields) => {
        if (err) {
            console.log("Failed to insert new product: " + err);
            res.sendStatus(500);
            return
        }
        console.log("Inserted a new product with id :" + results.insertId);
        res.end();
    })
});

/*Update Product by id */
//id	name	description	price	quantity	image	size	store_id
router.get('/:name/:description/:price/:quantity/:image/:size/:store_id/:id', (req, res)=>{
    console.log("Add product to the storeID : "+ req.params.store_id);
    console.log("Product with name : "+ req.params.name +" , description : "+ req.params.description +" , price : "+req.params.price+ "" +
        " , quantity :" + req.params.quantity + " , image : " + req.params.image +  " and size :" + req.params.size + " ,");
    const queryString = "update product set name = ? , description = ? , price = ? , quantity = ? , image = ? , size = ?, store_id = ? where id = ? ";
    getConnection().query(queryString, [req.params.name, req.params.description, req.params.price, req.params.quantity,
        req.params.image, req.params.size, req.params.store_id, req.params.id ],(err, results, fields) => {
        if (err) {
            console.log("Failed to update a product: " + err);
            res.sendStatus(500);
            return
        }
        console.log("update a product with id :" + results.insertId);
        res.end();
    })
});

//delete product
//DELETE FROM `product` WHERE `id` = 13
router.get('/:store_id/:id', (req, res)=>{
    console.log("Add product to the storeID : "+ req.params.store_id);
    console.log("Product with id : "+req.params.id+ " ");
    const queryString = "delete from  product where id = ? ";
    getConnection().query(queryString, [req.params.id ],(err, results, fields) => {
        if (err) {
            console.log("Failed to delete a product: " + err);
            res.sendStatus(500);
            return
        }
        console.log("delete product  :" + req.id);
        res.end();
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