const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 8000;

// Create a connection to the SQLite database
const db = new sqlite3.Database('students.sqlite');

// Create a table for students if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        gender TEXT,
        age INTEGER
    )`);
});

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to get all students or add a new student
app.route('/students')
    .get((req, res) => {
        db.all('SELECT * FROM students', (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    })
    .post((req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
        const values = [firstname, lastname, gender, age];

        db.run(sql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, message: 'Student created successfully' });
        });
    });

// Route to get, update, or delete a single student
app.route('/student/:id')
    .get((req, res) => {
        const id = req.params.id;
        const sql = 'SELECT * FROM students WHERE id = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(row);
        });
    })
    .put((req, res) => {
        const id = req.params.id;
        const { firstname, lastname, gender, age } = req.body;
        const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
        const values = [firstname, lastname, gender, age, id];

        db.run(sql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({ id: id, message: 'Student updated successfully' });
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM students WHERE id = ?';

        db.run(sql, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({ id: id, message: 'Student deleted successfully' });
        });
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
