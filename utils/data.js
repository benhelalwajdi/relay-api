var express = require('express');
var mysql = require('mysql');
var faker = require('faker');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();

/* Generate stores */
router.post('/generate_stores/:nb', (req, res) => {
    console.log("GENERATE DATA "+ req.params.nb);
    let nb = req.params.nb;

    for (var i=0; i < nb ; i++ ){
        var store = {
            name: faker.company.companyName(),
            mail: faker.internet.email(),
            password: "password",
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress() + faker.address.city() + faker.address.country(),
            userType: "STORE",
            storeType: faker.commerce.department(),
            date: new Date(),
        };

        const queryString = "INSERT INTO user (store_name, mail, password, phone_number," +
            " address, user_type, store_type,creation_date) VALUES (?,?,?,?,?,?,?,?)";

        getConnection().query(queryString, [store.name, store.mail, bcrypt.hashSync(store.password,
            bcrypt.genSaltSync(10)), store.phone, store.address, store.userType, store.storeType, new Date()],
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

/*Generate products*/
router.post('/generate_products/:id/:nb', (req, res) => {
    console.log("GENERATE PRODUCT " + req.params.nd);
    console.log("STORE: " + req.params.id);
    let nb = req.params.nb;

     for (var i=0; i < nb ; i++ ){
        var product = {
            name: "" + faker.commerce.product(),
            description: "" + faker.lorem.sentence(),
            price: "" + faker.commerce.price(),
            quantity: "" + faker.random.number(),
            size: "SMALL",
            store_id: "" + req.params.id,
        };
        console.log("LALALA");
        const queryString = "INSERT INTO product (name, description, price, quantity, size, store_id) VALUES (?,?,?,?,?,?)";

        getConnection().query(queryString, [product.name, product.description, product.price, product.quantity,
                product.size, product.store_id], (err, results, fields) => {
                if (err){
                    console.log("Failed to insert new product: " + err);
                    res.sendStatus(500);
                    return
                }
                console.log("Inserted a new product with id :" + results.insertId);
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
    connectionLimit: 50
});

function getConnection() {
    return pool;
}

//TEST SOMETHING

module.exports = router;
