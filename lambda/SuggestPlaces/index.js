const {fetchSuggestedPlaces} = require('./service');
exports.handler = async (event) => {
    try {
        const location = JSON.parse(event.body);
        let prompt = ``;
        if(location === null || location === undefined) {
            prompt = `Suggest four popular travel destinations based in India and current weather conditions.`;
        } else {    
            prompt = `Suggest four popular travel destinations based on the user's location: ${location.latitude}, ${location.longitude} and current weather conditions.`;
        }
        // Get suggested places from the Gemini API
        const geminiResponse = await fetchSuggestedPlaces({prompt});
        
        const response = {
            statusCode: 200,
            body: JSON.stringify(geminiResponse),
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while processing your request.' }),
        };
        return response;
    }
}