const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    featureId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Feature' // assuming your Feature model is named 'Feature'
    },
    user: String,
    text: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
