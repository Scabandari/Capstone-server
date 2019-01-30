"use strict";
require('mongoose');
const Reservation = require('../models/reservation');

module.exports = app => {
    app.post('/reservation', async (req, res) => {
        // let customer_id = req.param('user_id');
        // let spot_id = req.param('spot_id');
        console.log(`user_id: ${req.body.user_id}`);
        const reservation = new Reservation({
            customer: req.body.user_id,
            spot: req.body.spot_id
        });
        try {
            await reservation.save();
            res.send(reservation);
        } catch (err) {
            console.log(`Error creating new reservation in app.post('reservation', ... \n${err}`);
        }
    });
};