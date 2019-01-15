const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
const app = express();
const bodyParser = require('body-parser');

require('./models/contact');
require('./models/customer');
require('./models/lot');
require('./models/spot');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

//const router = express.Router();


require('./routes/lotRoutes')(app);
require('./routes/contactRoutes')(app);
require('./routes/customerRoutes')(app);

// app.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });
// });

//app.use('/api', router);



app.listen(port);
console.log('Magic happens on port ' + port);
