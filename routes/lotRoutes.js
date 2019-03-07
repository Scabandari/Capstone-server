"use strict";
const Lot = require('../models/lot');
require('mongoose');
//const utils = require('../functions/utils');

module.exports = app => {
  app.get('/lots', async (req, res) => {
      try {
        const lots = await Lot.find({});
        res.send(lots);
      } catch (err) {
        res.send(err);
      }
  });

  app.get('/lot', async (req, res) => {
      try {
          let id = req.query.lotId;
          const lot = await Lot.findById(id);
          res.send(lot);
      } catch (err) {
        res.send(err);
      }
  });

  app.post('/lot', async (req, res) => {
    //console.log('request body', req.body);
      try {
          const lot = await new Lot({
              street: req.body.street,
              city: req.body.city,
              postal: req.body.postal,
              business_name: req.body.business_name,
              contact: req.body.contact
          });
          await lot.save();
          res.send(lot);
      } catch (err) {
          res.send(err);
      }
  });

  app.put('/lot', async (req, res) => {
      try {
          const id = req.query.lotId;  // THIS IS REQUIRED BY CLIENTS USING API
          const lot = await Lot.findById(id);
          if (req.body.street)
              lot.street = req.body.street;
          if (req.body.postal)
              lot.postal = req.body.postal;
          if (req.body.city)
              lot.city = req.body.city;
          if (req.body.business_name)
              lot.business_name = req.body.business_name;
          if (req.body.contact)
              lot.contact = req.body.contact;
          await lot.save();
          res.send(lot);
      } catch (err) {
          res.send(err);
      }
  });
};


