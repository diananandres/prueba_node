const sqlite3 = require('sqlite3').verbose();

// Create a connection to the SQLite database
const db = new sqlite3.Database('students.sqlite');

// SQL query to create the students table
const sqlQuery = `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
)`;

// Execute the SQL query to create the table
db.run(sqlQuery, function(err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Students table created successfully');
});

// Close the database connection
db.close();
