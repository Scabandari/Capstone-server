"use strict";
//const Contact = require('../models/contact');
const Customer = require('../models/customer');
const Contact = require('../models/contact');
require('mongoose');

module.exports = app => {

  app.get('/login', async (req, res) => {
    let username = req.param('user_name');
    let password = req.param('pwrd');

    // console.log(`\req.params.: ${req.params}`);
    // console.log(`\nuname: ${username} pwrd: ${password}`);
    try {
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

  app.get('/customers', function(req, res) {
    //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
    Customer.find((err, contacts) => {
      if(err){
        res.send(err);
      }
      res.json(contacts);
    });
  });

  app.get('/customer', function(req, res) {
    let id = req.param('customerId');
    Customer.findById(id, (err, customer) => {
      if(err){
        res.send(err);
      }
      res.json(customer);
    });
  });

  app.put('/customer', (req, res) => {
    let id = req.param('customerId');
    Customer.findById(id, (err, customer) => {
      if (err) {
        res.send(err);
      }
      if(req.body.user_name)
        customer.user_name = req.body.user_name;
      if(req.body.password)
        customer.password = req.body.password;
      if(req.body.phone)
        customer.phone = req.body.phone;
      if(req.body.longitude)
        customer.longitude = req.body.longitude;
      customer.save().then(updated_customer => {
        res.send("Customer updated!");
      }).catch(err => {
        console.log("Error while trying to update customer:\n" + err);
        res.send(err);
      });
    });
  });

  app.post('/register', async (req, res) => {
    console.log('request body', req.body);
    //res.send('Works!');
    //req.body = JSON.stringify(req.body);
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
    new Customer({
      // first_name: req.body.params.first_name
      // user_name: req.param('user_name'),
      // password: req.param('password'),
        user_name: req.body.user_name,
        password: req.body.password,
      contact: contact._id
    }).save().then(customer => {
      res.send("Success!");
    }).catch(err => {
      console.log("Error while trying to save new customer to db:\n" + err);
    });
  });
};