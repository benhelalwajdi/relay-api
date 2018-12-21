var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');

var router = express.Router();

/* Login */
router.get('/user/:mail/:password', (req, res) => {
    var bool;
    console.log("Trying to login with EMAIL:" + req.params.mail + " PASSWORD:" + req.params.password);
    const queryString = "SELECT * FROM user WHERE mail = ?";
    const userMail = req.params.mail;
    getConnection().query(queryString, [userMail], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return
        }
        console.log("User fetched successfully");
        rows.map((row) => {
            console.log(row.password);
            if (bcrypt.compareSync(req.params.password, row.password)) {
                console.log("Password MATCH !");
                bool = true;
            } else {
                console.log(" WRONG Password !");
                bool = false;
            }
        });
        if (bool) {
            res.json(rows[0]);
        } else {
            res.json({user: null});
        }
    });
});

/* Upload image to server */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname)
    }
});
var upload = multer({storage: storage});
module.exports = upload;


/* Create new client */
router.post('/create_client', upload.single('image'), (req, res) => {
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO user (first_name, last_name, mail, password, phone_number," +
        " address, user_type, creation_date, image) VALUES (?,?,?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.mail, password,
        req.body.phone_number, req.body.address, 'CLIENT', new Date(), req.file.filename], (err, results) => {
        if (err) {
            console.log("Failed to insert new client: " + err);
            res.json({status: false, error: err});
        }
        console.log("Inserted a new client with id :" + results.insertId);
        res.json({status: true});
    });

});

/* Create new store */
router.post('/create_store',upload.single('image'), (req, res) => {
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO user (store_name, store_type, mail, password, address, phone_number," +
        " user_type, creation_date, image) VALUES (?,?,?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.store_name, req.body.store_type, req.body.mail, password,
        req.body.address, req.body.phone_number, 'STORE', new Date(), req.file.filename], (err, results) => {
        if (err) {
            console.log("Failed to insert new store: " + err);
            res.json({status: false, error: err});
        }
        console.log("Inserted a new store with id :" + results.insertId);
        res.json({status: true});
    });
});

/* Create new deliverer */
router.post('/create_deliverer', upload.single('image'), (req, res) => {
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO user (first_name, last_name, phone_number, address, mail, password, vehicle, " +
        "user_type, creation_date, image) VALUES (?,?,?,?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.address,
        req.body.mail, password, req.body.vehicle, 'DELIVERER', new Date(), req.file.filename], (err, results) => {
        if (err) {
            console.log("Failed to insert new deliverer: " + err);
            res.json({status: false, error: err});
        }
        console.log("Inserted a new deliverer with id :" + results.insertId);
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
