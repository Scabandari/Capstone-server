const mongoose = require('mongoose');
//const Contact = mongoose.model('contacts', Contact);

const Schema = mongoose.Schema;

const Customer = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // latitude: {
  //   type: Number
  // },
  // longitude: {
  //   type: Number
  // },
  contact: {  // can now access like customer.contact.first_name ...
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }
});

module.exports = mongoose.model('Customer', Customer);