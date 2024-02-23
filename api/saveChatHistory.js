const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('chatHistories');

    // Attempt to retrieve client IP from the request headers
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const { history } = req.body;

    const doc = {
        history: history,
        clientIp: clientIp, // Include the client IP in the document
        sessionStart: history[0]?.timestamp,
        sessionEnd: history[history.length - 1]?.timestamp,
        createdAt: new Date(),
    };

    try {
        await collection.insertOne(doc);
        res.status(200).json({ message: 'History saved successfully' });
    } catch (error) {
        console.error('Error saving chat history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};