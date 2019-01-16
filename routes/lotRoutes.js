"use strict";
const Lot = require('../models/lot');
//require('../models/contact');
const mongoose = require('mongoose');


module.exports = app => {
  app.get('/lots', (req, res) => {
    //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
    Lot.find().populate('contact').
    exec(function (err, lots) {
      if (err) {
        res.send(err);
      }
      res.json(lots);
    });
  });

  app.post('/lot', (req, res) => {
    console.log('request body', req.body);
    const lot = new Lot({
      street: req.body.street,
      city: req.body.city,
      postal: req.body.postal,
      business_name: req.body.business_name,
      contact: req.body.contact
    });

    lot.save().then(lots => {
      res.send("Success!");
    }).catch(err => {
      console.log("Error while trying to save new contact to db:\n" + err);
    });
  });
};


