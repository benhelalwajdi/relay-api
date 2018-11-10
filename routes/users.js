var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

/*Get user by mail. */
router.get('/user/:mail', (req, res) => {
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
        res.json(rows)
    })
});

/* Create new user. */
router.post('/create_user', (req, res) => {
    console.log("Trying to create new user ...");
    console.log("Email " + req.body.mail);
    const queryString = "INSERT INTO user (mail,password) VALUES (?,?)";
    let mail = req.body.mail;
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    getConnection().query(queryString, [mail, password], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new user: " + err);
            res.sendStatus(500);
            return
        }
        console.log("Inserted a new user with id :" + results.insertId);
        res.end();
    });
    res.end();
});

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Relay',
        port: '8889'
    });
}

module.exports = router;
