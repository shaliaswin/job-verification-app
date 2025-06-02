const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const PDFDocument = require("pdfkit");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')", [username, password], () => {
        res.redirect("/");
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
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
    const { start_date, deadline, material_type, area, cluster, blok, unit_no } = req.body;
    db.run(`INSERT INTO jobs (user_id, start_date, deadline, material_type, area, cluster, blok, unit_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.session.user.id, start_date, deadline, material_type, area, cluster, blok, unit_no],
        () => res.redirect("/user"));
});

app.get("/admin", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");
    const areaFilter = req.query.area || "";
    const query = areaFilter
        ? `SELECT jobs.*, users.username FROM jobs JOIN users ON jobs.user_id = users.id WHERE area = ? ORDER BY start_date ASC`
        : `SELECT jobs.*, users.username FROM jobs JOIN users ON jobs.user_id = users.id ORDER BY start_date ASC`;
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

app.get("/admin/export", (req, res) => {
    const areaFilter = req.query.area || "";
    const format = req.query.format || "pdf";
    const query = areaFilter
        ? `SELECT * FROM jobs WHERE area = ? ORDER BY start_date ASC`
        : `SELECT * FROM jobs ORDER BY start_date ASC`;
    const params = areaFilter ? [areaFilter] : [];

    db.all(query, params, (err, rows) => {
        if (format === "excel") {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=laporan.csv');
            res.write("No,Tanggal,Deadline,Material,Area,Cluster,Blok,No Unit,Status\n");
            rows.forEach((row, index) => {
                res.write(`${index + 1},${row.start_date},${row.deadline},${row.material_type},${row.area},${row.cluster},${row.blok},${row.unit_no},${row.is_verified ? "Diverifikasi" : "Belum"}\n`);
            });
            res.end();
        } else {
            const doc = new PDFDocument({ size: 'A4', margin: 30 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=laporan.pdf');
            doc.pipe(res);
            doc.fontSize(20).text("Laporan Perapihan Cluster", { align: "center" });
            doc.moveDown();

            const tableTop = 100;
            const rowHeight = 25;
            const colWidths = [30, 70, 70, 70, 60, 60, 50, 60, 80];
            const headers = ["No", "Tanggal", "Deadline", "Material", "Area", "Cluster", "Blok", "No", "Status"];

            headers.forEach((header, i) => {
                doc.text(header, colWidths.slice(0, i).reduce((a, b) => a + b, 30), tableTop, { width: colWidths[i] });
            });

            rows.forEach((row, i) => {
                const y = tableTop + (i + 1) * rowHeight;
                const data = [
                    i + 1, row.start_date, row.deadline, row.material_type,
                    row.area, row.cluster, row.blok, row.unit_no,
                    row.is_verified ? "Diverifikasi" : "Belum"
                ];
                data.forEach((text, j) => {
                    doc.text(text, colWidths.slice(0, j).reduce((a, b) => a + b, 30), y, { width: colWidths[j] });
                });
            });

            doc.end();
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
