const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Selection = new Schema({
  closest: {
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  },
  cheapest: {
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  },
  best: {
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  }
});

module.exports = mongoose.model('Selection', Selection);