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
  available: {
      type:Boolean,
      default: true
  },  // Means that a spot has not been reserved
  occupied: {
      type:Boolean,
      default: false
  },
  parking_lot: {
    type: Schema.Types.ObjectId,
    ref: 'Lot'
  }
});

module.exports = mongoose.model('Spot', Spot);