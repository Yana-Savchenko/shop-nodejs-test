const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const homeRoutes = require('./routes/home');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/add-course');

dotenv.config();
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

app.use(express.urlencoded({ extended: true }))

//routes

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add-course', addCourseRoutes);
app.use('/cart', cartRoutes);

//start server and connect to DB

async function start() {
  try {
    const PORT = process.env.PORT || 3000;
    const url = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0-qa9lw.mongodb.net/test?retryWrites=true&w=majority`;

    await mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (err) {
    console.log('error:', err);
  }
}

start();
