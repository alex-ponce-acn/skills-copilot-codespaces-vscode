// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'comments_db',
  password: 'password',
  port: 5432,
});

// Middleware
app.use(bodyParser.json());

// Routes
// Get all comments
app.get('/comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new comment
app.post('/comments', async (req, res) => {
  const { name, email, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (name, email, comment) VALUES ($1, $2, $3) RETURNING *',
      [name, email, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});