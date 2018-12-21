var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
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

/* Create new client */
router.post('/create_client', (req, res) => {
    let password = bcrypt.hashSync(req.params.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO user (first_name, last_name, mail, password, phone_number," +
        " address, user_type, creation_date) VALUES (?,?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.first_name, req.body.last_name, req.body.mail, password,
        req.body.phone_number, req.body.address, 'CLIENT', new Date()], (err, results) => {
        if (err) {
            console.log("Failed to insert new client: " + err);
            res.json({status: false, error: err});

        }
        console.log("Inserted a new client with id :" + results.insertId);
        res.json({status: true});
    });
});

/* Create new store */
router.post('/create_store', (req, res) => {
    let password = bcrypt.hashSync(req.params.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO user (store_name, store_type, mail, password, address, phone_number," +
        " user_type, creation_date) VALUES (?,?,?,?,?,?,?,?)";
    getConnection().query(queryString, [req.body.store_name, req.body.store_type, req.body.mail, password,
        req.body.address, req.body.phone_number, 'STORE', new Date()], (err, results) => {
        if (err) {
            console.log("Failed to insert new store: " + err);
            res.json({status: false, error: err});

        }
        console.log("Inserted a new store with id :" + results.insertId);
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
