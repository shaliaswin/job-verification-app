const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const mainRoutes = require('./app/routes/main');
app.use('/', mainRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
