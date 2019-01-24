'use strict';
const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const GPS = require('gps');
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
const app = express();
//const gps = new GPS;  seems not to be needed
const bodyParser = require('body-parser');
const logger = require('morgan');

require('./models/contact');
require('./models/customer');
require('./models/lot');
require('./models/spot');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

const port = process.env.PORT || 8080;        // set our port

//const router = express.Router();

require('./routes/contactRoutes')(app);
require('./routes/customerRoutes')(app);
require('./routes/lotRoutes')(app);
require('./routes/spotRoutes')(app);

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');

app.get('/', (req, res) => {
  res.send("Working!")
});

app.post('/authenticate', (req, res) => {

  const credentials = auth(req);

  if (!credentials) {

    res.status(400).json({ message: 'Invalid Request !' });

  } else {

    login.loginUser(credentials.name, credentials.pass)

      .then(result => {

        const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

        res.status(result.status).json({ message: result.message, token: token });

      })

      .catch(err => res.status(err.status).json({ message: err.message }));
  }
});

app.post('/users', (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

    res.status(400).json({message: 'Invalid Request !'});

  } else {

    register.registerUser(name, email, password)

      .then(result => {

        res.setHeader('Location', '/users/'+email);
        res.status(result.status).json({ message: result.message })
      })

      .catch(err => res.status(err.status).json({ message: err.message }));
  }
});

app.get('/users/:id', (req,res) => {

  if (checkToken(req)) {

    profile.getProfile(req.params.id)

      .then(result => res.json(result))

      .catch(err => res.status(err.status).json({ message: err.message }));

  } else {

    res.status(401).json({ message: 'Invalid Token !' });
  }
});

app.put('/users/:id', (req,res) => {

  if (checkToken(req)) {

    const oldPassword = req.body.password;
    const newPassword = req.body.newPassword;

    if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

      res.status(400).json({ message: 'Invalid Request !' });

    } else {

      password.changePassword(req.params.id, oldPassword, newPassword)

        .then(result => res.status(result.status).json({ message: result.message }))

        .catch(err => res.status(err.status).json({ message: err.message }));

    }
  } else {

    res.status(401).json({ message: 'Invalid Token !' });
  }
});

app.post('/users/:id/password', (req,res) => {

  const email = req.params.id;
  const token = req.body.token;
  const newPassword = req.body.password;

  if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

    password.resetPasswordInit(email)

      .then(result => res.status(result.status).json({ message: result.message }))

      .catch(err => res.status(err.status).json({ message: err.message }));

  } else {

    password.resetPasswordFinish(email, token, newPassword)

      .then(result => res.status(result.status).json({ message: result.message }))

      .catch(err => res.status(err.status).json({ message: err.message }));
  }
});

function checkToken(req) {

  const token = req.headers['x-access-token'];

  if (token) {

    try {

      var decoded = jwt.verify(token, config.secret);

      return decoded.message === req.params.id;

    } catch(err) {

      return false;
    }

  } else {

    return false;
  }
}

//app.use('/api', router);

// GET THE DISTANCE BETWEEEN 2 GPS COORDINATES
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y
console.log("Montreal to N.Y is: " + distance);

app.listen(port);
console.log('Magic happens on port ' + port);
