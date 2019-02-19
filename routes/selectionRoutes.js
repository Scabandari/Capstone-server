'use strict';
const GPS = require('gps');
const Spot = require('../models/spot');
const Selection = require('../models/selection');
require('mongoose');
const utils = require('../functions/utils');

module.exports = app => {
  app.post('/selection', async (req, res) => {
    // const lat = req.param('lat');
    // const long = req.param('long');
    const lat = req.body.lat;
    const long = req.body.long;
    //console.log(`lat: ${lat}, long: ${long}`);
    try {
      const spots = await Spot.find({available: true});
      //console.log(`spots: ${typeof spots}\n`);
      const { closest, closest_distance } = utils.closestParking(lat, long, spots);
      //console.log(`closest: ${closest} closest_distance: ${closest_distance}\n`);
      const cheapest = utils.cheapestParking(spots);
      const cheapest_distance = GPS.Distance(lat, long, cheapest.latitude, cheapest.longitude);
      //const best = closest;  // TODO CHANGE THIS

         try {
             const best = await Spot.findById("5c4b7dba70a1d00ef70e8d8a");
             const best_distance = GPS.Distance(lat, long, best.latitude, best.longitude);

             cheapest.available = false;
             await cheapest.save();
             //console.log(`cheapest: ${cheapest._id}`);
             closest.available = false;
             await closest.save();
             //console.log(`closest: ${closest._id}`);
             best.available = false;
             await best.save();

             // const cheapest = await Spot.findById("5c4b7e1570a1d00ef70e8d8c");
             // const cheapest_distance = GPS.Distance(lat, long, cheapest.latitude, cheapest.longitude);
             //
             // const closest = await Spot.findById("5c4b7de670a1d00ef70e8d8b");
             // const closest_distance = GPS.Distance(lat, long, closest.latitude, closest.longitude);

             const selection = await new Selection({
                 closest: {
                     spot: closest,
                     distance: closest_distance
                 },
                 cheapest: {
                     spot: cheapest,
                     distance: cheapest_distance
                 },
                 best: {
                     spot: best,  //TODO BEST SHOULD NOT BE HARDCODED
                     distance: best_distance
                 }
             });
             await selection.save();
             res.send(selection);
         } catch (err) {
             res.send(err);
         }

    } catch (err) {
      console.log(err);
    }
  });

  app.get('/selections', async (req, res) => {
    try {
        const selections = await Selection.find();
        res.send(selections);
    } catch (err) {
        res.send(err);
    }
  });
};