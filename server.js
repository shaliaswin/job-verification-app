const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'public/uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let users = { admin: 'admin' };
let entries = [];

app.get('/', (req, res) => {
    if (req.session.username) return res.redirect('/entry');
    res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    if (users[req.body.username] === req.body.password) {
        req.session.username = req.body.username;
        res.redirect('/entry');
    } else {
        res.send('Login failed');
    }
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
    users[req.body.username] = req.body.password;
    res.redirect('/login');
});

app.get('/entry', (req, res) => {
    if (!req.session.username) return res.redirect('/login');
    res.render('entry', { date: new Date().toISOString().slice(0,10) });
});

app.post('/entry', upload.single('photo'), (req, res) => {
    entries.push({
        date: new Date().toISOString().slice(0,10),
        material: req.body.material,
        area: req.body.area,
        cluster: req.body.cluster,
        blok: req.body.blok,
        unit: req.body.unit,
        photo: req.file.filename
    });
    res.redirect('/entry');
});

app.get('/admin', (req, res) => {
    if (req.session.username !== 'admin') return res.redirect('/login');
    const filter = req.query.cluster;
    const filtered = filter ? entries.filter(e => e.cluster.includes(filter)) : entries;
    res.render('admin', { entries: filtered });
});

app.get('/export', (req, res) => {
    let csv = "Date,Material,Area,Cluster,Blok,Unit,Photo\\n";
    entries.forEach(e => {
        csv += `${e.date},${e.material},${e.area},${e.cluster},${e.blok},${e.unit},${e.photo}\\n`;
    });
    fs.writeFileSync("export.csv", csv);
    res.download("export.csv");
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
