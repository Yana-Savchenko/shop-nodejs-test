const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars settings

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

//server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    `Server is running on port ${PORT}`
})