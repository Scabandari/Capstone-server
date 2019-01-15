const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Contact = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('Contact', Contact);