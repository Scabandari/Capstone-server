'use strict';
const GPS = require('gps');
require('mongoose');
const Spot = require('../models/spot');
//https://stackoverflow.com/questions/30273993/javascript-best-way-to-structure-helpers-functions-in-nodejs
// so lotRoutes for how to import functions
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y

module.exports = {
  closestParking: (user_lat, user_long, spots) => {  // todo if isWithinRange() ..
    let closest = spots[0];
    //console.log(`closest: ${closest}`);
    let min = Infinity;
    let old_distance = GPS.Distance(user_lat, user_long, closest.latitude, closest.longitude);
    //console.log(`old_distanceP: ${old_distance}`);
    Object.keys(spots).forEach(key => {
      let spot = spots[key];
      const new_distance = GPS.Distance(user_lat, user_long, spot.latitude, spot.longitude);
      //console.log(`spot: ${spot._id} distance: ${new_distance}`);
      if(new_distance < old_distance){
        closest = spot;
        old_distance = new_distance;
      }
    }); // Object.keys
    let closest_distance = old_distance;
    //console.log(`closest: ${closest}`);
    return {closest, closest_distance };
  },
  cheapestParking: (spots) => {  // todo if isWithinRange() ..
    spots = Object.values(spots);
    //console.log(`spots type: ${typeof spots} spots: ${spots}`);
    let cheapest = spots[0];
    let old_price  = cheapest.price_minute;
    Object.keys(spots).forEach(key => {
      let spot = spots[key];
      const new_price = spot.price_minute;
      if (new_price < old_price) {
        cheapest = spot;
        old_price = new_price;
      }
    });
    return cheapest;
    },
  // bestParking: (lat, long, spots) => {  TODO fill this in
  // },
  // isWithinRange(user_id) {  TODO fill this in
  //   // check if parking space is within acceptable distance
  // }
};