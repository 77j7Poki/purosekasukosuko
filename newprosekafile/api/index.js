const { MongoClient, ServerApiVersion } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = "mongodb+srv://egoatto:ArxbymJyJfihxLFt@cluster0.gy0ux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // 環境変数から読み込むのがベスト
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();
    const db = client.db('myDatabase'); // データベース名を設定
    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export default async function handler(req, res) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('counts'); // コレクション名を設定

        if (req.method === 'GET') {
            // カウントを取得
            const countsDoc = await collection.findOne({});
            if (countsDoc) {
                return res.json({ counts: countsDoc.counts });
            } else {
                return res.json({ counts: [0, 0, 0, 0] });
            }
        } else if (req.method === 'POST') {
            const button = parseInt(req.query.button, 10);
            if (button >= 1 && button <= 4) {
                // 現在のカウントを取得して更新
                const countsDoc = await collection.findOne({});
                let counts = countsDoc ? countsDoc.counts : [0, 0, 0, 0];
                counts[button - 1]++;
                await collection.updateOne({}, { $set: { counts: counts } }, { upsert: true });
                return res.json({ count: counts[button - 1] });
            } else {
                return res.status(400).send('Invalid button number');
            }
        } else {
            return res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return res.status(500).send('Internal Server Error');
    }
}
