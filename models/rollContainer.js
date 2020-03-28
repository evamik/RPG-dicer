const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rollContainerSchema = new Schema({
    username: { type: String, required: true},
    description: { type: String, required: false},
    date: { type: String, required: true},
    result: { type: Number, required: true},
    bonus: { type: Number, required: true},
    R: { type: Number, required: true},
    G: { type: Number, required: true},
    B: { type: Number, required: true},
    rolls: { type: Array, required: true}
},{
    timestamps: true,
});

const RollContainer = mongoose.model('RollContainer', rollContainerSchema)

module.exports = RollContainer;