var express = require('express');
var mysql = require('mysql')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Relay',
        port:'8889'
    })

    const userId = req.params.id
    const queryString = "SELECT * FROM user WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields)=>{
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
            // throw err
        }
        console.log("User fetched successfully")
/*
        //Format JSON
        const users = rows.map((row)=>{
            return {email: row.mail}
        })
*/
        res.json(rows)
    })
})

module.exports = router;
