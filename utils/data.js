var express = require('express');
var mysql = require('mysql');
var faker = require('faker');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();


router.post('/generate_stores/:nb', (req, res) => {
    console.log("GENERATE DATA"+ req.params.nb);
    let nb = req.params.nb;

    for (i=0; i < nb ; i++ ){
        var store = {
            name: faker.company.companyName(),
            mail: faker.internet.email(),
            password: "password",
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress() + faker.address.city() + faker.address.country(),
            clientType: "STORE",
            storeType: faker.commerce.department(),
            date: new Date()
        }

        const queryString = "INSERT INTO user (store_name, mail, password, phone_number," +
            " address, client_type, store_type,creation_date) VALUES (?,?,?,?,?,?,?,?)";

        getConnection().query(queryString, [store.name, store.mail, bcrypt.hashSync(store.password,
            bcrypt.genSaltSync(10)), store.phone, store.address, store.clientType, store.storeType, new Date()],
            (err, results, fields) => {
                if (err) {
                    console.log("Failed to insert new store: " + err);
                    res.sendStatus(500);
                    return
                }
                console.log("Inserted a new store with id :" + results.insertId);
                res.end();
            });
    }
    res.end();
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
