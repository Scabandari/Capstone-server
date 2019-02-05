"use strict";
require('mongoose');
const Reservation = require('../models/reservation');

module.exports = app => {
    app.post('/reservation', async (req, res) => {
        //console.log(`user_id: ${req.body.user_id}`);
        const reservation = new Reservation({
            customer: req.body.user_id,
            spot: req.body.spot_id
        });
        try {
            await Reservation.populate(reservation, {path: "spot"});
            await Reservation.populate(reservation, {path: "customer"});
            await reservation.save();
            res.send(reservation);
        } catch (err) {
            console.log(`Error creating new reservation in app.post('reservation', ... \n${err}`);
        }
    });

    app.get('/reservations', async function(req, res) {
        try {
            const reservations = await Reservation.find({});
            res.send(reservations);
        } catch (err) {
            res.send(err);
        }
    });

    app.delete('/reservation', async function(req, res) {
        const id = req.query.reservationId;
        Reservation.findByIdAndRemove(id, (err, reservation) => {
            if (err) {
                return res.send(err);
            }
            res.send("Reservation successfully deleted");
        });
    });
};