const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
    title: String,
    description: String,
    votes: { type: Number, default: 0 },
    votedUsers: [String],
    comments: [{ user: String, text: String, date: { type: Date, default: Date.now } }],
});
const Feature = mongoose.model("Feature", FeatureSchema);

module.exports = Feature;