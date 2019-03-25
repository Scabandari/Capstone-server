const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Purchase = Schema({
    start_time: {
        type: Date,
        default: Date.now
    },
    duration_minutes: {
        type: Number,
        default: 0,
    },
    //price_minute: Number,
    total_cost: {
        type: Number,
        default: 0,
    },
    bill_payed: {
        type: Boolean,
        default: false
    },
    bill_sent: {
        type: Boolean,
        default: false
    },
    concluded: {
        type: Boolean,
        default: false
    },
    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
    }
});

module.exports = mongoose.model('Purchase', Purchase);
