let counts = [0, 0, 0, 0]; // サーバー起動時にカウントを初期化

export default function handler(req, res) {
    if (req.method === 'POST') {
        const button = parseInt(req.query.button, 10);
        if (button >= 1 && button <= 4) {
            counts[button - 1]++;
            return res.json({ count: counts[button - 1] });
        } else {
            return res.status(400).send('Invalid button number');
        }
    } else {
        return res.status(405).send('Method Not Allowed');
    }
}
