const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const GPS = require('gps');
const utils = require('./functions/utils');
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
const app = express();
//const gps = new GPS;  seems not to be needed
const bodyParser = require('body-parser');

const Contact = require('./models/contact');
const Customer = require('./models/customer');
require('./models/lot');
require('./models/spot');
const Reservation = require('./models/reservation');
const Purchase = require('./models/purchase');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;        // set our port

//const router = express.Router();

require('./routes/contactRoutes')(app);
require('./routes/customerRoutes')(app);
require('./routes/lotRoutes')(app);
require('./routes/spotRoutes')(app);
require('./routes/selectionRoutes')(app);
require('./routes/reservationRoutes')(app);
require('./routes/purchaseRoutes')(app);

// function intervalFunc() {
//     console.log('Cant stop me now!');
// }
// setInterval(intervalFunc, 1500);
//app.use('/api', router);

// GET THE DISTANCE BETWEEEN 2 GPS COORDINATES
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y
console.log("Montreal to N.Y is: " + distance);

// Every 5 sec loop through all Purchases, if concluded is true and bill sent is false send bill email
setInterval(async () => {
    console.log("I get printed every 5 seconds");
    const purchases = await Purchase.find({});
    //console.log(JSON.stringify(purchases));
    purchases.forEach(async (purchase, index) => {
        console.log("inside for loop executes");
        //console.log(JSON.stringify(purchase));
        if (purchase.concluded === true && purchase.bill_sent === false) {
            // await purchase.populate(purchase, {path: 'reservation'});
            await purchase.populate('reservation');
            const reservation_id = purchase.reservation._id;
            const reservation = await Reservation.findById(purchase.reservation._id);
            await reservation.populate('customer');
            const customer = await Customer.findById(reservation.customer._id);
            await customer.populate('contact');
            const contact = await Contact.findById(customer.contact._id);


            console.log(`I should send that email here: ${contact.email}`);
        }
    })
}, 5000);

app.listen(port);
console.log('Magic happens on port ' + port);
