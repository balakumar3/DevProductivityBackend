const { Router } = require('express');
const run = require('../utils/geminiApi');
const requirementRouter = Router();

requirementRouter.post("/getDetailedRequirements", async (req, res) => {
    try {
        const { inputData } = req.body;
        const response = await run(inputData);
        return res.json(response)
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = requirementRouter;