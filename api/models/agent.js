const mongoose = require('mongoose');

const agentScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    income: {type: Number, required: true},
    agentImage: {type: String, required: true}
});

module.exports = mongoose.model('Agent', agentScheme);