const mongoose = require("mongoose");

// Define Knowledge Schema
const KnowledgeSchema = new mongoose.Schema({
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    tags: [String],
    category: String,
    createdAt: { type: Date, default: Date.now },
});

// Full-text search index for efficient searching
KnowledgeSchema.index({ problem: "text", solution: "text" });

const Knowledge = mongoose.model("Knowledge", KnowledgeSchema);

module.exports = Knowledge;