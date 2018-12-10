var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var multer = require('multer');
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
    message : "Error! in image upload.";
    if (!req.file) {
        console.log("No file received");
        message = "Error! in image upload.";
        res.render('index',{message: message, status:'danger'});

    } else {
        console.log('file received');
        console.log(req.file.filename);
       /*    var sql = "INSERT INTO user(`name`, `type`, `size`) VALUES ('" + req.file.filename + "', '"+req.file.mimetype+"', '"+req.file.size+"')";

        var query = db.query(sql, function(err, result) {
            console.log('inserted data');
        });*/
        message = "Successfully! uploaded";
        res.render('index',{message: message, status:'success'});
    }
});

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
/*app.post('/employees', function (req, res) {
    var postData  = req.body;
    connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});*/
router.post('/add', function (req, res){
    console.log(req.headers);
    console.log(req.body);
    const FORM_URLENCODED = 'application/form-data';
    console.log("Add product to the storeID : " + req.body.store_id);
        console.log("Product with name : " + req.body.name + " , description : " + req.body.description +
            " , price : " + req.body.price + " , quantity :" + req.body.quantity + " , image : " + req.body.image + " and size :" + req.body.size + " ,");
        const queryString = "INSERT INTO product (name, description, price, quantity, image," +
            "size, store_id) VALUES (?,?,?,?,\"https://www.magidglove.com/assets/item/hero/620_HERO.jpg\",?,?)";
        getConnection().query(queryString, [req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.size, req.body.store_id], (err, results, fields) => {
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
        console.log("delete product  :" + req.params.id);
        res.end();
    })
});

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wbh52',
    database: 'relay',
    port: '3306',
    connectionLimit: 10
});

function getConnection() {
    return pool;
}

module.exports = router;