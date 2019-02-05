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

require('./models/contact');
require('./models/customer');
require('./models/lot');
require('./models/spot');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8004;        // set our port

//const router = express.Router();

require('./routes/contactRoutes')(app);
require('./routes/customerRoutes')(app);
require('./routes/lotRoutes')(app);
require('./routes/spotRoutes')(app);
require('./routes/selectionRoutes')(app);
require('./routes/reservationRoutes')(app);



//app.use('/api', router);

// GET THE DISTANCE BETWEEEN 2 GPS COORDINATES
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y
console.log("Montreal to N.Y is: " + distance);


app.listen(port);
console.log('Magic happens on port ' + port);
