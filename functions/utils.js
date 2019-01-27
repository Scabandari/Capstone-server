'use strict';
const GPS = require('gps');
require('mongoose');
const Spot = require('../models/spot');
//https://stackoverflow.com/questions/30273993/javascript-best-way-to-structure-helpers-functions-in-nodejs
// so lotRoutes for how to import functions
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y

module.exports = {
  // closestParking: async (user_lat, user_long) => {
  //   try {
  //     const spots = await Spot.find({available: true}).exec();
  // //     console.log(`spots: ${spots}`);
  // //     return spots
  // //   } catch (err) {
  // //     return 'Error occured';
  // //   }
  // // },
  // closestParking: async (user_lat, user_long, spots) => {
  //   let spot_distances = spots.map(spot => {
  //     let distance = GPS.Distance(user_lat, user_long, spot.latitude, spot.longitude);
  //     // return {
  //     //   spot,
  //     //   distance
  //     // };
  //     return distance;
  //   });
  // },
  // cheapestParking: (user_id) => {
  //   //
  // },
  // isWithinRange(user_id) {
  //   // check if parking space is within acceptable distance
  // }
};