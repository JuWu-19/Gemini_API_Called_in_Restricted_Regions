## Gemini API in Restricted Regions

### Motivation

This project circumvents the regional restrictions of the Gemini API, allowing global access. It uses a proxy to route requests and employs serverless functions hosted on Vercel for managing chat history and API interactions. The design ensures that users can interact with the Gemini API from any location seamlessly.

### Usage

1. Install Dependencies:

    npm install

    {
  "dependencies": {
    "@google/generative-ai": "^0.2.1",
    "mongodb": "^6.3.0"
  }
}


2. Configure Environment Variables:

Set up 'GEMINI_API_KEY', 'MONGODB_URI', and 'DB_NAME' in your environment.

3. Run the Project:

Deploy on Vercel and access the application.
