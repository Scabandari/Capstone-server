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