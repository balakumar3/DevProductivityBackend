const { Router } = require('express');
const featureRouter = Router();
const Feature = require('../models/Feature');

featureRouter.post("/features", async (req, res) => {
    const feature = new Feature(req.body);
    await feature.save();
    res.json(feature);
});

// Get all features
featureRouter.get("/features", async (req, res) => {
    const features = await Feature.find();
    res.json(features);
});

// Upvote a feature
featureRouter.post("/features/:id/vote", async (req, res) => {
    const featureId = req.params.id;
    const user = req.body.user;

    try {
        const feature = await Feature.findById(featureId);

        if (!feature) return res.status(404).json({ message: "Feature not found" });

        if (feature.votedUsers.includes(user)) {
            return res.status(400).json({ message: "User has already voted" });
        }

        feature.votes += 1;
        feature.votedUsers.push(user);
        await feature.save();

        res.json(feature);
    } catch (err) {
        res.status(500).json({ message: "Error voting feature", error: err });
    }
});

// Add a comment to a feature
featureRouter.post("/features/:id/comment", async (req, res) => {
    const feature = await Feature.findById(req.params.id);
    feature.comments.push({ user: req.body.user, text: req.body.text });
    await feature.save();
    res.json(feature);
});

featureRouter.delete("/features/:id", async (req, res) => {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (feature) {
        res.json({ message: "Feature deleted successfully" });
    } else {
        res.status(404).json({ message: "Feature not found" });
    }
});

module.exports = featureRouter;