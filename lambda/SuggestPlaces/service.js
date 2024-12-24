require('dotenv').config();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  } = require("@google/generative-ai");
  
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

class SuggestedPlaces {
    constructor(name, image, description) {
      this.name = name;
      this.image = image;
      this.description = description;
    }
}

const generationConfig_places = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        response_schema: Array[SuggestedPlaces]
    };
const model_places = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: `You are a travel guide that suggests interesting places to visit based on a given location. Your output should be a list of suggested places in JSON format, including the name, image URL, and a brief description of each place.
      
      Follow these guidelines:
      
      Place Details: Provide the name, image URL, and a brief description for each suggested place.
      Diversity: Suggest a diverse range of places, including popular tourist spots, hidden gems, and offbeat locations.
      Relevance: Ensure the suggested places are relevant to the given location and provide a mix of cultural, historical, natural, and recreational sites.
      
      JSON Structure: Ensure the output is clear and readable, with attributes such as name, image, and description.
      
      Generate a list of well-organized, interesting places to visit that fit within the given location.`
    });

    async function fetchSuggestedPlaces(locationDetains) {
        const chatSession = model_places.startChat({
          generationConfig_places,
        });
        const result = await chatSession.sendMessage(locationDetains.prompt);
        return result.response.text();
      }


module.exports = {  
    fetchSuggestedPlaces,
};
  
