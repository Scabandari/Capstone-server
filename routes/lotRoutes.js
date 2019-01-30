"use strict";
const Lot = require('../models/lot');
require('mongoose');
//const utils = require('../functions/utils');

module.exports = app => {
  app.get('/lots', (req, res) => {
    //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
    Lot.find().populate('Contact').
    exec(function (err, lots) {
      if (err) {
        res.send(err);
      }
      //utils.clostestParking("user id");
      res.json(lots);
    });
  });

  app.get('/lot', function(req, res) {
    let id = req.param('lotId');
    Lot.findById(id, (err, lot) => {
      if(err){
        res.send(err);
      }
      res.json(lot);
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

  app.put('/lot', (req, res) => {
    let id = req.param('lotId');  // THIS IS REQUIRED BY CLIENTS USING API
    Lot.findById(id, (err, lot) => {
      if(err) {
        res.send(err);
      }
      // console.log(`\nMaking PUT request for parking spot ${id}\n`);
      // console.log(req.body);
      if(req.body.street)
        lot.street = req.body.street;
      if(req.body.postal)
        lot.postal = req.body.postal;
      if(req.body.city)
        lot.city = req.body.city;
      if(req.body.business_name)
        lot.business_name = req.body.business_name;
      if(req.body.contact)
        lot.contact = req.body.contact;
      lot.save().then(saved_lot => {
        res.send("Parking spot updated!");
      }).catch(err => {
        console.log("Error while trying to update parking spot.\n");
        res.send(err);
      });
    });
  });
};


