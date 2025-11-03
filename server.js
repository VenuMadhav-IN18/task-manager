import express from 'express';
import db from './db/config.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.render('index', { tasks: results });
  });
});

app.post('/add', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, false], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

// ✅ Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

