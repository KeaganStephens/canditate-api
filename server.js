// server.js
const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const port = 3100;

app.use(express.json());

const initializeDatabase = async () => {
  try {
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        job_title TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        website TEXT,
        experience_years INTEGER,
        professional_summary TEXT,
        hard_skills TEXT,
        soft_skills TEXT
      );
    `);

    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

initializeDatabase();

app.post('/candidates', async (req, res) => {
  try {
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });

    const {
      name,
      job_title,
      email,
      phone,
      address,
      website,
      experience_years,
      professional_summary,
      hard_skills,
      soft_skills,
    } = req.body;

    // Insert candidate data into the candidates table
    await db.run(
      `
      INSERT INTO candidates
      (name, job_title, email, phone, address, website, experience_years, professional_summary, hard_skills, soft_skills)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        job_title,
        email,
        phone,
        address,
        website,
        experience_years,
        professional_summary,
        hard_skills,
        soft_skills,
      ]
    );

    console.log('Candidate information added to the database.');
    res.status(201).send('Candidate information added to the database.');
  } catch (error) {
    console.error('Error adding candidate information:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
