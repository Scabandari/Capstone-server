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
const nodemailer = require('nodemailer');

const Contact = require('./models/contact');
const Customer = require('./models/customer');
require('./models/lot');
const Spot = require('./models/spot');
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

const diff_minutes = (time1, time2) => {
    let diff = (time2.getTime() - time1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
};

const DEVELOPER_GMAIL = 'developer.rion@gmail.com';

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: DEVELOPER_GMAIL,
       pass: 'developerpass'
   }
});

let mailOptions = {
    from: DEVELOPER_GMAIL,
    to: '',
    subject: 'Thank you for using UPark it',
    text: ''
};

const mailOptionsText = (duration, spot, cost) => {
    const thanks = 'Thank you for choosing UPark it!\n';
    const your_stay = `You stayed in parking spot ${spot.number} at $${spot.price_minute} for ${duration} minutes.\n`;
    const bill = `Your bill: $${cost.toFixed(2)} CAD`;
    return thanks.concat(your_stay, bill);
};

// Every 5 sec loop through all Purchases, if concluded is true and bill sent is false send bill email
setInterval(async () => {
    //console.log("I get printed every 5 seconds");
    try {
        const purchases = await Purchase.find({});
        //console.log(JSON.stringify(purchases));
        purchases.forEach(async (purchase, index) => {
            //console.log("inside for loop executes");
            //console.log(JSON.stringify(purchase));
            //if (purchase.concluded === true && purchase.bill_sent === false) {
            if (purchase.concluded === false) {
                // await purchase.populate(purchase, {path: 'reservation'});
                //await purchase.populate('reservation');
                const reservation_id = purchase.reservation._id;
                const reservation = await Reservation.findById(purchase.reservation._id);
                //await reservation.populate('spot');
                const spot = await Spot.findById(reservation.spot);
                //console.log(`index spot: ${JSON.stringify(spot)}`);
                if (spot.occupied !== true) {
                    const date_today = new Date();
                    // console.log(`Time: ${date}`);
                    // console.log(`Time(min): ${date.getMinutes()}`);
                    // console.log(`Time(day): ${date.getDay()}`);
                    // console.log(`Time(hour): ${date.getHours()}`);
                    let mins = diff_minutes(purchase.start_time, date_today);
                    if (mins < 1) {
                        mins = 1;
                    }
                    console.log(`Difference mins: ${mins}`);
                    purchase.duration = mins;
                    purchase.total_cost = mins * spot.price_minute;
                    //await reservation.populate('customer');
                    const customer = await Customer.findById(reservation.customer._id);
                    //await customer.populate('contact');
                    const contact = await Contact.findById(customer.contact._id);
                    mailOptions.to = contact.email;
                    mailOptions.text = mailOptionsText(mins, spot, purchase.total_cost);
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(`Error sending mail: ${error}`);
                        } else {
                            console.log(`Email sent: ${info.response}`);
                        }
                    });
                    purchase.bill_sent = true;
                    purchase.concluded = true;
                    await purchase.save();
                }



                //console.log(`I should send that email here: ${contact.email}`);
            }
        })
    } catch (err) {
        console.log(`Purchase Loop Error: ${err}`);
    }
}, 5000);

// const cleanContacts = async () => {
//     const contacts = await Contact.find({});
//     contacts.forEach(async (contact, index) => {
//             try {
//                 console.log(contact.first_name);
//                 contact.email = DEVELOPER_GMAIL;
//                 await contact.save();
//             } catch (err) {
//
//             }
//             //console.log("NO first name");
//     });
// };
//
// cleanContacts();

app.listen(port);
console.log('Magic happens on port ' + port);
