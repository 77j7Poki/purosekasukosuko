let counts = [0, 0, 0, 0]; // サーバー起動時にカウントを初期化

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.json({ counts });
    } else {
        return res.status(405).send('Method Not Allowed');
    }
}
