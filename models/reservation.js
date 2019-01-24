const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema({
  start_time: {
    type: Date,
    default: Date.now
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  spot: {
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  }
});

module.exports = mongoose.model('Reservation', Reservation);