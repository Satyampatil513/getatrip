require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const models = {
  trips: genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: `Provide JSON response with trip details.`,
  }),
  itinerary: genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: `Generate a detailed travel itinerary in JSON format.`,
  }),
  places: genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: `Suggest places to visit based on location.`,
  }),
};

const generatePromptResponse = async (model, generationConfig, prompt) => {
  const chatSession = model.startChat(generationConfig);
  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
};

module.exports = {
  models,
  generatePromptResponse,
};
