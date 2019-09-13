var express = require('express');
var mysql = require('mysql');
var multer = require('multer');


var router = express.Router();

/* GET product listing */
router.get('/', (req, res) => {
    console.log("Fetching product :" + req.params.id);

    const queryString = "SELECT * FROM product order by date desc";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for products " + err);
            res.json({status: false, error: err});
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

    const queryString = "SELECT * FROM product WHERE store_id = ? ORDER BY id DESC";
    getConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for product by storeID " + err);
            res.json({status: false, error: err});
        }
        console.log("Products fetched by type successfully");
        res.json(rows)
    });
});

//TODO: Check if the code below works !

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+'.'+file.originalname)
    }
});
var upload = multer({storage: storage});

module.exports = upload;


router.post('/upload',upload.single('profile'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        message = "Error! in image upload.";
        res.render('index',{message: message, status:'danger'});

    } else {
        console.log('file received');
        console.log(req.file.filename);
        message = "Successfully! uploaded";
        res.json({image: req.file.filename});
    }
});


/* ADD new product */
router.post('/create_product', function (req, res){
    console.log(req.headers);
    console.log(req.body);
    console.log("Add product to the storeID : " + req.body.store_id);
    console.log("Product with name : " + req.body.name + " , description : " + req.body.description +
        " , price : " + req.body.price + " , quantity :" + req.body.quantity + " , image : " + req.body.image +
        " and size :" + req.body.size + " ,");
    const queryString = "INSERT INTO product (name, description, price, quantity, image," +
        "size, store_id) VALUES (?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.name, req.body.description, req.body.price, req.body.quantity,
       req.body.image, req.body.size, req.body.store_id], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new product: " + err);
            res.json({status: false, error: err});
        }
        console.log("Inserted a new product with id :" + results.insertId);
        res.json({status: true});
    });
});

/* UPDATE product */
router.post('/update_product', function (req, res){
    console.log(req.headers);
    console.log(req.body);
    console.log("update product to the store with ID : " + req.body.store_id);
    console.log("Product with name : " + req.body.name + " , description : " + req.body.description +
        " , price : " + req.body.price + " , quantity :" + req.body.quantity + " , size :" + req.body.size + " , image :"+ req.body.image);
    const queryString = "update product set name = ? , description = ? , price = ? , quantity = ? , " +
        "image = ? , size = ? where id = ?";
    getConnection().query(queryString, [req.body.name, req.body.description, req.body.price, req.body.quantity,req.body.image,
        req.body.size,  req.body.id], (err, results, fields) => {
        if (err) {
            console.log("Failed to update product: " + err);
            res.json({status: false, error: err});
        }
        console.log("update a  product with id :" + req.body.id);
        res.json({status: true});
    })
});

/* Delete product */
router.post('/delete_product', function (req, res){
    console.log(req.headers);
    console.log(req.body);
    console.log("Add product to the store with ID : " + req.body.id);
    const queryString = "delete from Product where id = ?";
    getConnection().query(queryString, [req.body.id], (err, results, fields) => {
        if (err) {
            console.log("Failed to delete product: " + err);
            res.json({status: false, error: err});
        }
        console.log("Delete product ");
        res.json({status: true});
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
