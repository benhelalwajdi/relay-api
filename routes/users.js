var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

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
            res.json(rows);
        } else {
            res.json(null);
        }
    });
});

/* Get user by mail. */
/*router.get('/user/:mail', (req, res) => {
    console.log("Fetching user with mail: " + req.params.id);

    const userMail = req.params.mail;
    const queryString = "SELECT * FROM user WHERE mail = ?";
    getConnection().query(queryString, [userMail], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return
        }
        console.log("User fetched successfully");
        /*
                //Format JSON
                const users = rows.map((row)=>{
                    return {email: row.mail}
                })
        */
/*        res.json(rows)
    })
});
*/


/* Create new user. */
router.post('/create_user', (req, res) => {
    let mail = req.body.mail;
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    if (req.body.user_type == ("CLIENT")) {
        const queryString = "INSERT INTO user (first_name, last_name, mail, password, phone_number," +
            " address, user_type, creation_date) VALUES (?,?,?,?,?,?,?,?)";
        getConnection().query(queryString, [req.body.first_name, req.body.last_name, mail, password,
            req.body.phone_number, req.body.address, req.body.user_type, new Date()], (err, results, fields) => {
            if (err) {
                console.log("Failed to insert new user: " + err);
                res.sendStatus(500);
                return
            }
            console.log("Inserted a new user with id :" + results.insertId);
            res.end();
        });
    }
    console.log("Email " + req.body.mail);
    res.end();
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
