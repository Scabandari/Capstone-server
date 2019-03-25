"use strict";
require('mongoose');
const Reservation = require('../models/reservation');

module.exports = app => {
    app.post('/reservation', async (req, res) => {
        //console.log(`user_id: ${req.body.user_id}`);
        try {
            const reservation = new Reservation({
                customer: req.body.user_id,
                spot: req.body.spot_id
            });
            await Reservation.populate(reservation, {path: "spot"});
            await Reservation.populate(reservation, {path: "customer"});
            await reservation.save();
            res.send(reservation);
        } catch (err) {
            console.log(`Error creating new reservation in app.post('reservation', ... \n${err}`);
        }
    });

    app.put('/reservation', async (req, res) => {
        //console.log(`PUT Spot: ${JSON.stringify(req.body)}`);
        try {
            const id = req.query.reservationId;
            const reservation = await Reservation.findById(id);
            if (req.body.cancelled)
                reservation.cancelled = req.body.cancelled;
            await reservation.save();
            res.send(reservation);
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/reservations', async function(req, res) {

        try {
            const reservations = await Reservation.find({});
            console.log(`reservations[0] Time: ${reservations[0].start_time}`);
            res.send(reservations);
        } catch (err) {
            res.send(err);
        }
    });

    app.delete('/reservation', async function(req, res) {
       try {
           const id = req.query.reservationId;
           Reservation.findByIdAndRemove(id, (err, reservation) => {
               if (err) {
                   return res.send(err);
               }
               res.send("Reservation successfully deleted");
           });
       } catch (err) {
           res.send(err);
       }
    });
};