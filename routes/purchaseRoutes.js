"use strict";
require('mongoose');
const Purchase = require('../models/purchase');

module.exports = app => {
    app.post('/purchase', async (req, res) => {
        //console.log(`user_id: ${req.body.user_id}`);
        try {
            const purchase = new Purchase({
                reservation: req.body.res_id,
            });
            //await purchase.populate(purchase, {path: "reservation"});
            await purchase.save();
            res.send(purchase);
        } catch (err) {
            console.log(`Error creating new purchase in app.post('purchase', ... \n${err}`);
        }
    });

    app.get('/purchases', async function(req, res) {
        try {
            const purchases = await Purchase.find({});
            res.send(purchases);
        } catch (err) {
            res.send(err);
        }
    });

    app.delete('/purchase', async function(req, res) {
        try {
            const id = req.query.purchaseId;
            Purchase.findByIdAndRemove(id, (err, purchase) => {
                if (err) {
                    return res.send(err);
                }
                res.send("purchase successfully deleted");
            });
        } catch (err) {
            res.send(err);
        }
    });
};