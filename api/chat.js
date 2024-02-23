// Node.js code for the Vercel serverless function
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }
    console.log("Data to be parsed:", req.body);
    // Parse the incoming request
    const {newMessage,history} = req.body;

    const simpleHistory = history.map(({ sender, message }) => {
        // Map 'Bot' to 'model' and 'User' to 'user'
        const role = sender === 'Bot' ? 'model' : 'user';
        return {
          role: role,
          parts: message, // Directly assign message as a string
        };
      });

    console.log("Simple History", simpleHistory);
    try {
        // Assume `startChat` initializes a chat session, and `sendMessage` sends a message
        const chatSession = await genAI.getGenerativeModel({ model: "gemini-1.0-pro-latest" }).startChat({
            history: simpleHistory,
            generationConfig: { maxOutputTokens:8000},
        });

        // Sending the new message to the chat session
        const result = await chatSession.sendMessage(newMessage);
        const botResponse = await result.response; // This should be adjusted based on how you receive the response
        const botMessage = await botResponse.text(); // Adjust based on actual API response structure
        console.log("Raw answer:", botMessage);

        // Update the detailed chat history with the bot's response
        history.push({ sender: "Bot", message: botMessage, timestamp: new Date().toISOString() });

        // Respond to the client with the bot's message
        res.json({ text: botMessage });
    } catch (error) {
        console.error("Error during chat session:", error);
        res.status(500).json({ error: "Failed to process the chat message" });
    }
};