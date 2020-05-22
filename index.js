const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/add-course');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Handlebars settings

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//Parse request

app.use(express.urlencoded({extended: true}))

//routes

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add-course', addCourseRoutes);
app.use('/cart', cartRoutes);

//server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `Server is running on port ${PORT}`
})