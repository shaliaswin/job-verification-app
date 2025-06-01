const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./database.db");
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        role TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        job_name TEXT,
        start_date TEXT,
        deadline TEXT,
        is_verified INTEGER DEFAULT 0
    )`);
    db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
        if (!row) {
            db.run("INSERT INTO users (username, password, role) VALUES ('admin', 'admin', 'admin')");
        }
    });
});

app.get("/", (req, res) => res.render("login"));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (user) {
            req.session.user = user;
            if (user.role === "admin") res.redirect("/admin");
            else res.redirect("/user");
        } else res.send("Login gagal");
    });
});

app.get("/user", (req, res) => {
    if (!req.session.user || req.session.user.role !== "user") return res.redirect("/");
    db.all("SELECT * FROM jobs WHERE user_id = ?", [req.session.user.id], (err, jobs) => {
        res.render("dashboard_user", { user: req.session.user, jobs });
    });
});

app.get("/user/add", (req, res) => {
    if (!req.session.user || req.session.user.role !== "user") return res.redirect("/");
    res.render("add_job");
});

app.post("/user/add", (req, res) => {
    const { job_name, start_date, deadline } = req.body;
    db.run("INSERT INTO jobs (user_id, job_name, start_date, deadline) VALUES (?, ?, ?, ?)",
        [req.session.user.id, job_name, start_date, deadline],
        () => res.redirect("/user"));
});

app.get("/admin", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");
    db.all("SELECT jobs.*, users.username FROM jobs JOIN users ON jobs.user_id = users.id", [], (err, jobs) => {
        res.render("dashboard_admin", { jobs });
    });
});

app.post("/admin/verify/:id", (req, res) => {
    db.run("UPDATE jobs SET is_verified = 1 WHERE id = ?", [req.params.id], () => {
        res.redirect("/admin");
    });
});
// Halaman form register
app.get("/register", (req, res) => {
    res.render("register");
});

// Proses form register
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, 'user'],
        (err) => {
            if (err) {
                console.error(err);
                return res.send("Gagal mendaftar");
            }
            res.redirect("/");
        });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
