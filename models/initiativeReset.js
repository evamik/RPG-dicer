const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const initiativeResetSchema = new Schema({
    date: { type: String, required: true},
},{
    timestamps: true,
});

const InitiativeReset = mongoose.model('InitiativeReset', initiativeResetSchema)

module.exports = InitiativeReset;