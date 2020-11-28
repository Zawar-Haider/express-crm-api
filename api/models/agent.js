const mongoose = require('mongoose');

const agentScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    income: Number
});

module.exports = mongoose.model('Agent', agentScheme);