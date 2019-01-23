"use strict";
//const Contact = require('../models/contact');
const Customer = require('../models/customer');
const mongoose = require('mongoose');

module.exports = app => {
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
      if(req.body.latitude)
        customer.latitude = req.body.latitude;
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

  app.post('/customer', (req, res) => {
    console.log('request body', req.body);
    //res.send('Works!');
    new Customer({
      // first_name: req.body.params.first_name
      user_name: req.body.user_name,
      contact: req.body.contact
    }).save().then(customer => {
      res.send("Success!");
    }).catch(err => {
      console.log("Error while trying to save new customer to db:\n" + err);
    });
  });
};