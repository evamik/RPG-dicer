const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rollSchema = new Schema({
    username: { type: String, required: true},
    description: { type: String, required: false},
    rollCount: { type: Number, required: true},
    rollSize: { type: Number, required: true},
    rollResult: { type: Number, required: true},
    rollBonus: { type: Number, required: true},
    date: { type: String, required: true},
    R: { type: Number, required: true},
    G: { type: Number, required: true},
    B: { type: Number, required: true},
    ownDice: { type: Boolean, required: true}
},{
    timestamps: true,
});

const Roll = mongoose.model('Roll', rollSchema)

module.exports = Roll;