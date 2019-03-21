"use strict";
const Spot = require('../models/spot');
//require('../models/contact');
require('mongoose');


module.exports = app => {
    app.get('/spots', async (req, res) => {
        //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
        //Spot.find().populate('parking_lot').
        try {
            const spots = await Spot.find().populate('parking_lot');
            res.send(spots);
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/spot', async (req, res) => {
        const id = req.query.spotId;
        try {
            const spot = await Spot.findById(id);
            res.send(spot);
        } catch (err) {
            res.send(err);
        }
    });

    app.put('/spot', async (req, res) => {
        console.log(`PUT Spot: ${JSON.stringify(req.body)}`);
        try {
            const id = req.query.spotId;
            const spot = await Spot.findById(id);
            if (req.body.number)
                spot.number = req.body.number;
            if (req.body.price_minute)
                spot.price_minute = req.body.price_minute;
            if (req.body.latitude)
                spot.latitude = req.body.latitude;
            if (req.body.longitude)
                spot.longitude = req.body.longitude;
            if (req.body.parking_lot)
                spot.parking_lot = req.body.parking_lot;
            if (req.body.available)
                spot.available = req.body.available;
            if (req.body.occupied)
                spot.occupied = req.body.occupied;
            await spot.save();
            res.send(spot);
        } catch (err) {
            res.send(err);
        }
    });

    // this is just for testing to quickly change them all
    // not for production use
    app.get('/spots/reset', async (req, res) => {
        try {
            const spots = await Spot.find();
            console.log(spots);

            spots.map(async spot => {
                spot.available = true;
                spot.occupied = false;
                //spot.occupied = false;
                await spot.save();
            });

            res.send("Success!");
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/spot', async (req, res) => {
        console.log('request body', req.body);
        console.log(`req.body.number: ${req.body.number}`);
        console.log(`Number(req.body.number): ${Number(req.body.number)}`);

        try {
            const spot = await new Spot({
                number: req.body.number,
                price_minute: req.body.price_minute,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                parking_lot: req.body.parking_lot,
                available: req.body.available
            });
            await spot.save();
            res.send(spot);
        } catch (err) {
            res.send(err);
        }
    });
};
