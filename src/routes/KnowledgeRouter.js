const { Router } = require('express');
const Knowledge = require('../models/Knowledge');
const knowledgeRouter = Router();

knowledgeRouter.post("/knowledge", async (req, res) => {
    try {
        const entry = new Knowledge(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all knowledge entries
knowledgeRouter.get("/knowledge", async (req, res) => {
    const entries = await Knowledge.find();
    res.json(entries);
});

// Search knowledge entries
knowledgeRouter.get("/search", async (req, res) => {
    const { query } = req.query;

    let results;

    if (!query) {
        // If query is empty, fetch all records
        results = await Knowledge.find({});
    } else {
        // Use regex to perform "like" pattern matching on multiple fields
        const regex = new RegExp(query, 'i'); // case-insensitive search

        results = await Knowledge.find({
            $or: [
                { problem: { $regex: regex } },
                { solution: { $regex: regex } },
                { tags: { $elemMatch: { $regex: regex } } }, // For array field 'tags'
                { category: { $regex: regex } }
            ]
        });
    }

    res.json(results);
});

knowledgeRouter.put("/knowledge/:id", async (req, res) => {
    try {
        const entry = await Knowledge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = knowledgeRouter;