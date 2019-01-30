const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Selection = new Schema({
  closest: {
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot'
    },
    distance: Number
  },
  cheapest:{
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot'
    },
    distance: Number
  },
  best: {
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot'
    },
    distance: Number
  }
});

module.exports = mongoose.model('Selection', Selection);