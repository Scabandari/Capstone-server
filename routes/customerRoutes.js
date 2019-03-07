"use strict";
//const Contact = require('../models/contact');
const Customer = require('../models/customer');
const Contact = require('../models/contact');
require('mongoose');

module.exports = app => {

    app.get('/login', async (req, res) => {

        try {
            const username = req.query.user_name;
            const password = req.query.pwrd;
            const customer = await Customer.findOne({user_name: username});
            //console.log(`custs: ${customer}`);
            if (!customer) {
                res.send("Username not found");
            } else if (customer.password != password) {
                res.send("Incorrect password");
            } else {
                res.send(customer);
            }
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/customers', async (req, res) => {
        try {
            const customers = await Customer.find({});
            res.send(customers);
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/customer', async (req, res) => {
        //let id = req.param('customerId');
        try {
            const id = req.query.customerId;
            const customer = await Customer.findById(id);
            res.send(customer);
        } catch (err) {
            res.send(err);
        }
    });

    app.put('/customer', async (req, res) => {
        //console.log(`customerId: ${id}`);
        try {
            const id = req.query.customerId;
            const customer = await Customer.findById(id);
            if (req.body.user_name)
                customer.user_name = req.body.user_name;
            if (req.body.password)
                customer.password = req.body.password;
            if (req.body.phone)
                customer.phone = req.body.phone;
            if (req.body.longitude)
                customer.longitude = req.body.longitude;
            await customer.save();
            res.send("Customer updated!");
        } catch (err) {
            console.log("Error while trying to update customer:\n" + err);
            res.send(err);
        }
    });

    app.post('/register', async (req, res) => {
        //console.log('request body', req.body);
        try {
            const contact = new Contact({
                // first_name: req.param('first_name'),
                // last_name: req.param('last_name'),
                // phone: req.param('phone'),
                // email: req.param('email'),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone,
                email: req.body.email,
            });
            await contact.save();
            const customer = new Customer({
                // first_name: req.body.params.first_name
                // user_name: req.param('user_name'),
                // password: req.param('password'),
                user_name: req.body.user_name,
                password: req.body.password,
                contact: contact._id
            });
            await customer.save();
            res.send(customer);
        } catch (err) {
            res.send(err);
        }
    });
};