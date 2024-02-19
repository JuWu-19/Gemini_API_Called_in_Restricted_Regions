import { GoogleGenerativeAI } from "@google/generative-ai";


async function sendMessage(message) {
    // Display user's message in the chat container
    appendMessageToChatContainer("User", message);
    // Initialize chat or append to existing chat history in your app's state
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const { text } = await response.json();

        // Display bot's response in the chat container
        appendMessageToChatContainer("Bot", text);
    } catch (error) {
        console.error("Error sending message:", error);
        // Attempt to parse and log the specific error message from the API if available
        let detailedErrorMessage = error.response ? await error.response.text() : "No detailed error message available.";
        console.log("Detailed error message:", detailedErrorMessage);
        const errorMessage = "Sorry, I couldn't fetch a response. Please try again later.";
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