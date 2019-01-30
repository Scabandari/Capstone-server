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
      const best = closest;  // TODO CHANGE THIS
        // cheapest.available = false;
      //cheapest.available = false;  TODO uncomment this
      await cheapest.save();
      //console.log(`cheapest: ${cheapest._id}`);
      //closest.available = false;
      await closest.save;
      //console.log(`closest: ${closest._id}`);
      //best.available = false;
      await best.save;

      const selection = new Selection({
        closest: {
          spot: closest,
          distance: closest_distance
        },
        cheapest: {
          spot: cheapest,
          distance: cheapest_distance
        },
        best: {
          spot: best,
          distance: cheapest_distance
        }
      });
      selection.save().then(selection => {
        //console.log(`selection: ${selection}`);
        res.send(selection);
      });

    } catch (err) {
      console.log(err);
    }
  });

  app.get('/selections', async (req, res) => {
    const selections = await Selection.find();
    res.send(selections);
  });
};