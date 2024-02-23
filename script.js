
// Assuming we have an empty array to store the chat history
let chatHistory = [];

function appendMessageToChatContainer(sender, message, timestamp) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${timestamp} - ${sender}: ${message}`;
    chatContainer.appendChild(messageElement);
}

async function sendMessage(message) {
    const timestamp = new Date().toISOString(); // ISO format timestamp
    // Add user message to chat history with timestamp
 //   chatHistory.push({ sender: "User", message: message, timestamp: timestamp });
    appendMessageToChatContainer("User", message, timestamp);

    try {
        // Send the new message and the current chat history for context
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Note: Only the latest message is needed as per the server logic, but we'll send the whole history
            body: JSON.stringify({ newMessage: message, history: chatHistory }),
        });

        // Debugging: Log the raw response
        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);

        // Check if the response is JSON before attempting to parse it
        if (response.headers.get("Content-Type").includes("application/json")) {
            const data = JSON.parse(rawResponse); // Parse the response as JSON
            // Add bot's response to chat history with timestamp

            chatHistory.push({ sender: "User", message: message, timestamp: timestamp });
            chatHistory.push({ sender: "Bot", message: data.text, timestamp: new Date().toISOString() });
            // Display bot's response in the chat container
            appendMessageToChatContainer("Bot", data.text, new Date().toISOString());
        } else {
            // Handle non-JSON responses or errors
            console.error("Received non-JSON response");
            appendMessageToChatContainer("Bot", "Error: Non-JSON response received", new Date().toISOString());
        }
    } catch (error) {
        console.error("Error sending message:", error);
        let detailedErrorMessage = error.response ? await error.response.text() : "No detailed error message available.";
        console.log("Detailed error message:", detailedErrorMessage);
        const errorMessage = "Sorry, I couldn't fetch a response. Please try again later.";
        appendMessageToChatContainer("Bot", errorMessage, new Date().toISOString());
        chatHistory.push({ sender: "User", message: message, timestamp: timestamp });
        chatHistory.push({ sender: "Bot", message: errorMessage, timestamp: new Date().toISOString() });
    }
}

document.getElementById('sendBtn').addEventListener('click', function() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== "") {
        sendMessage(userInput);
        document.getElementById('userInput').value = ''; // Clear input field after sending
    }
});

function saveChatHistoryOnClose() {
    window.addEventListener('beforeunload', (event) => {
        // Prevent the default browser behavior to ensure the chat history is sent
        event.preventDefault();
        event.returnValue = '';

        // Send chat history to Vercel serverless function upon session end
        const blob = new Blob([JSON.stringify({ history: chatHistory })], { type: 'application/json' });
        navigator.sendBeacon('/api/saveChatHistory', blob);
        
        // Optionally clear the chat history from local storage or state if desired
    });
}

// Call the function to set up the unload event listener
saveChatHistoryOnClose();