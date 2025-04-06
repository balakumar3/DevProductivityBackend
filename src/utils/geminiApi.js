const {
    GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv/config');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(inputData) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(inputData);
    return result.response.text();
    // console.log(result.response.text());
}
// "what is india famous for? explain in 100 words"
//run(); 

module.exports = run;