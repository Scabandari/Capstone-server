"use strict";
const Contact = require('../models/contact');
const mongoose = require('mongoose');

module.exports = app => {
  app.get('/contacts', function(req, res) {
    //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
    Contact.find((err, contacts) => {
      if(err){
        res.send(err);
      }
      res.json(contacts);
    });
  });

  app.get('/contact', function(req, res) {
    let id = req.param('contactId');
    Contact.findById(id, (err, contact) => {
      if(err){
        res.send(err);
      }
      res.json(contact);
    });
  });

  app.put('/contact', (req, res) => {
    //let id = req.params.id;
    let id = req.param('contactId');
    Contact.findById(id, (err, con) => {
      if (err) {
        res.send(err);
      }
      con.first_name = req.body.first_name;
      con.last_name = req.body.last_name;
      con.phone = req.body.phone;
      con.email = req.body.email;
      con.save().then(contact => {
        res.send("Contact updated!");
      }).catch(err => {
        console.log("Error while trying to update contact:\n" + err);
        res.send(err);
      });
    });
  });

  app.post('/contact', (req, res) => {
    console.log('request body', req.body);
    const contact = new Contact({
      // first_name: req.body.params.first_name
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.first_name
    });
    contact.save().then(contact => {
      res.send("Success!");
    }).catch(err => {
      console.log("Error while trying to save new contact to db:\n" + err);
    });
  });
};