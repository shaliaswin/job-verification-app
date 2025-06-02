const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./database.db");
const PORT = process.env.PORT || 3000;
const { job_name, start_date, deadline, material_type, area, cluster, blok, unit_no } = req.body;
const PDFDocument = require('pdfkit');

app.get("/admin/export", (req, res) => {
    const areaFilter = req.query.area || "";
    const query = areaFilter
        ? `SELECT * FROM jobs WHERE area = ? ORDER BY start_date ASC`
        : `SELECT * FROM jobs ORDER BY start_date ASC`;
    const params = areaFilter ? [areaFilter] : [];

    db.all(query, params, (err, rows) => {
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=laporan.pdf');
        doc.pipe(res);

        doc.fontSize(18).text("Laporan Perapihan Cluster", { align: "center" });
        doc.moveDown();

        rows.forEach(row => {
            doc.fontSize(12).text(
                `Tanggal: ${row.start_date} | Deadline: ${row.deadline}\nMaterial: ${row.material_type} | Area: ${row.area} | Cluster: ${row.cluster}, Blok: ${row.blok}, No: ${row.unit_no}\nStatus: ${row.is_verified ? '✔ Diverifikasi' : '❌ Belum'}\n\n`
            );
        });

        doc.end();
    });
});







db.run(`INSERT INTO jobs 
(user_id, job_name, start_date, deadline, material_type, area, cluster, blok, unit_no)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
[req.session.user.id, job_name, start_date, deadline, material_type, area, cluster, blok, unit_no],
() => res.redirect("/user"));
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
    material_type TEXT,
    area TEXT,
    cluster TEXT,
    blok TEXT,
    unit_no TEXT,
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
    const areaFilter = req.query.area || ""; // ambil dari query string
    const query = areaFilter
        ? `SELECT jobs.*, users.username FROM jobs 
           JOIN users ON jobs.user_id = users.id 
           WHERE area = ? ORDER BY start_date ASC`
        : `SELECT jobs.*, users.username FROM jobs 
           JOIN users ON jobs.user_id = users.id 
           ORDER BY start_date ASC`;

    const params = areaFilter ? [areaFilter] : [];

    db.all(query, params, (err, jobs) => {
        res.render("dashboard_admin", { jobs, areaFilter });
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
