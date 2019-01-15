const mongoose = require('mongoose');
// const Contact = require('./contact');

const Schema = mongoose.Schema;

const Lot = new Schema({
  street: {
    type: String
  },
  city: {
    type: String
  },
  postal: {
    type: String
  },
  business_name: {
    type: String
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }
});

module.exports = mongoose.model('Lot', Lot);