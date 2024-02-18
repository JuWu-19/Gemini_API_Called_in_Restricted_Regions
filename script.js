import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCJ-oLIAxrtPovYJeW6zs2MGJFBxRqn1Aw"; // Use a secure method to include your API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function sendMessage(message) {
    // Display user's message in the chat container
    appendMessageToChatContainer("User", message);
    // Initialize chat or append to existing chat history in your app's state
    try {
    const chat = model.startChat({
        history: [], // Your chat history goes here
        generationConfig: { maxOutputTokens: 1000 },
    });


    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = await response.text();
    console.log(text); // Log the response for debugging


    // Display bot's response in the chat container
    appendMessageToChatContainer("Bot", text);
    } catch (error) {
    console.error("Error sending message:", error);
    // Display error reason as bot's output
    let errorMessage = "Sorry, I couldn't fetch a response. Please try again later.";
    if (error instanceof Error) {
        // Optionally include more specific error details if appropriate
        errorMessage = `Error: ${error.message}`;
    }
    appendMessageToChatContainer("Bot", errorMessage);
    }
}

function appendMessageToChatContainer(sender, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatContainer.appendChild(messageElement);
}

document.getElementById('sendBtn').addEventListener('click', function() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== "") { // Check if the input is not just whitespace
        sendMessage(userInput);
        document.getElementById('userInput').value = ''; // Clear input field after sending
    }
});