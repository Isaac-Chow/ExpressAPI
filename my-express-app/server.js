const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/data', (req, res) => {
    const newData = req.body;
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the database.' });
        }
        const database = JSON.parse(data);
        database.data.push(newData);
        fs.writeFile('database.json', JSON.stringify(database, null, 2), err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write to the database.' });
            }
            res.json(newData);
        });
    });
});

app.get('/data', (req, res) => {
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the database.' });
        }
        const database = JSON.parse(data);
        res.json(database.data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});