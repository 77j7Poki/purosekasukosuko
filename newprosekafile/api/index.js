const { MongoClient, ServerApiVersion } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = process.env.MONGODB_URI; // 環境変数からURIを取得
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const db = client.db('myDatabase'); // データベース名を設定
        cachedClient = client;
        cachedDb = db;
        console.log("Connected to MongoDB");
        return { client, db };
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error('Database connection failed');
    }
}

export default async function handler(req, res) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('counts'); // コレクション名を設定

        if (req.method === 'GET') {
            const countsDoc = await collection.findOne({});
            if (countsDoc) {
                console.log("Retrieved counts:", countsDoc.counts);
                return res.json({ counts: countsDoc.counts });
            } else {
                console.log("No counts found, initializing...");
                return res.json({ counts: [0, 0, 0, 0] });
            }
        } else if (req.method === 'POST') {
            const button = parseInt(req.query.button, 10);
            if (button >= 1 && button <= 4) {
                const countsDoc = await collection.findOne({});
                let counts = countsDoc ? countsDoc.counts : [0, 0, 0, 0];
                counts[button - 1]++;
                await collection.updateOne({}, { $set: { counts: counts } }, { upsert: true });
                console.log("Updated counts:", counts);
                return res.json({ count: counts[button - 1] });
            } else {
                console.error("Invalid button number:", button);
                return res.status(400).send('Invalid button number');
            }
        } else {
            console.error("Method not allowed:", req.method);
            return res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).send('Internal Server Error');
    }
}
