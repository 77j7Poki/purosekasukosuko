const counts = [0, 0, 0, 0]; // グローバルスコープで一時的に保持

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.json({ counts });
    } else {
        return res.status(405).send('Method Not Allowed');
    }
}
