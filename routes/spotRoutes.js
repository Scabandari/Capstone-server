"use strict";
const Spot = require('../models/spot');
//require('../models/contact');
require('mongoose');


module.exports = app => {
  app.get('/spots', (req, res) => {
    //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
    //Spot.find().populate('parking_lot').
    Spot.find().populate('Lot').
    exec(function (err, lots) {
      if (err) {
        res.send(err);
      }
      res.json(lots);
    });
  });

  app.get('/spot', function(req, res) {
    let id = req.param('spotId');
    Spot.findById(id, (err, spot) => {
      if(err){
        res.send(err);
      }
      res.json(spot);
    });
  });

  app.put('/spot', (req, res) => {
    let id = req.param('spotId');  // THIS IS REQUIRED BY CLIENTS USING API
    Spot.findById(id, (err, spot) => {
      if(err) {
        res.send(err);
      }
      // console.log(`\nMaking PUT request for parking spot ${id}\n`);
      // console.log(req.body);
      if(req.body.number)
        spot.number = req.body.number;
      if(req.body.price_minute)
        spot.price_minute = req.body.price_minute;
      if(req.body.latitude)
        spot.latitude = req.body.latitude;
      if(req.body.longitude)
        spot.longitude = req.body.longitude;
      if(req.body.parking_lot)
        spot.parking_lot = req.body.parking_lot;
      if(req.body.available)
        spot.available = req.body.available;
      spot.save().then(saved_spot => {
        res.send("Parking spot updated!");
      }).catch(err => {
        console.log("Error while trying to update parking spot.\n");
        res.send(err);
      });
    });
  });

  app.post('/spot', (req, res) => {
    console.log('request body', req.body);
    const spot = new Spot({
      number: req.body.number,
      price_minute: req.body.price_minute,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      parking_lot: req.body.parking_lot,
      available: req.body.available
    });
    spot.save().then(new_spot => {
      res.send("Success!");
    }).catch(err => {
      console.log("Error while trying to save new parking spot to db:\n" + err);
    });
  });
};
