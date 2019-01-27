'use strict';
const GPS = require('gps');
const Spot = require('../models/spot');
const Selection = require('../models/selection');
require('mongoose');
const utils = require('../functions/utils');

module.exports = app => {
  app.get('/selection', (req, res) => {
    let lat = req.params.lat;
    let long = req.params.long;

    Spot.find({available: true}).then(spots => {
      let closest = spots[0];
      let old_distance = Infinity;
      let new_distance = Infinity;

      Object.keys(spots).forEach(key => {
        let spot = spots[key];
        new_distance = GPS.Distance(lat, long, spot.latitude, spot.longitude);
        if(new_distance < old_distance){
          closest = spot;
          old_distance = new_distance;
        }
      }); // Object.keys
      // todo find the cheapest
      let cheapest = spots[0];
      let min = Infinity;
      Object.keys(spots).forEach(key => {
        if(spots[key].price_minute < min) {
          cheapest = spots[key];
          min = spots.price_minute;
        }
      }); // Object.keys
      new Selection({  // TODO response sends parking spot _ids not actual parking spots
        closest: closest._id,
        cheapest: cheapest._id,
        best: cheapest._id
      }).save().then(selection => {
        res.send(selection);
      }).catch(err => {
        res.send(err);
      });
      //res.send(closest);
    }).catch(err => {
      res.send(err);
    });
  }); // app.get
};