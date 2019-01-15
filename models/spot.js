const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Spot = new Schema({
  number: {
    type: Number
  },
  price_minute: {
    type: Number
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  parking_lot: {
    type: Schema.Types.ObjectId,
    ref: 'lots'
  }
});

module.exports = mongoose.model('Spot', Spot);