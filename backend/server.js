const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crowdfunding'
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// API routes
app.get('/api/stories', (req, res) => {
    db.query('SELECT * FROM stories WHERE is_approved = true', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/stories', (req, res) => {
    const { title, image_url, target_amount } = req.body;
    db.query('INSERT INTO stories (title, image_url, target_amount, collected_amount, is_approved) VALUES (?, ?, ?, 0, false)', [title, image_url, target_amount], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId });
    });
});

app.post('/api/donations', (req, res) => {
    const { story_id, donor_name, amount } = req.body;
    db.query('INSERT INTO donations (story_id, donor_name, amount) VALUES (?, ?, ?)', [story_id, donor_name, amount], (err) => {
        if (err) return res.status(500).send(err);
        db.query('UPDATE stories SET collected_amount = collected_amount + ? WHERE id = ?', [amount, story_id], (err) => {
            if (err) return res.status(500).send(err);
            res.sendStatus(200);
        });
    });
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Replace with your admin credentials check
    if (username === 'admin' && password === 'adminpassword') {
        const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).send('Unauthorized');
});

app.get('/api/admin/stories', (req, res) => {
    db.query('SELECT * FROM stories', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/api/admin/stories/:id/approve', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE stories SET is_approved = true WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

app.delete('/api/admin/stories/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM stories WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});