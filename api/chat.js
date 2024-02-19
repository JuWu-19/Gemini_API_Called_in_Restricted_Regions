import { GoogleGenerativeAI } from '@google/generative-ai';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY; // Securely stored in Vercel's environment variables
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        try {
            const chat = model.startChat({
                history: [], // Implement history management as needed
                generationConfig: { maxOutputTokens: 1000 },
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = await response.text();

            res.status(200).json({ text });
        } catch (error) {
            const errorDetails = {
                timestamp: new Date().toISOString(),
                error: error.message,
                stack: error.stack,
                messageAttempted: message,
            };
            console.error('Enhanced Error in serverless function:', JSON.stringify(errorDetails, null, 2));
            console.error('Error in serverless function:', error);
            res.status(500).json({ text: "Sorry, there was an error processing your request." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
