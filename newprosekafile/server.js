const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

let counts = [0, 0, 0, 0];

app.post('/tap', (req, res) => {
    const button = parseInt(req.query.button, 10);
    if (button >= 1 && button <= 4) {
        counts[button - 1]++;
        res.json({ count: counts[button - 1] });
    } else {
        res.status(400).send('Invalid button number');
    }
});

app.get('/counts', (req, res) => {
    res.json({ counts });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
