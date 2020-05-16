const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.static('public'));

// Handlebars settings

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


//routes

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'Home',
      isHome: true,
    }
  );
});

app.get('/courses', (req, res) => {
  res.render(
    'courses',
    {
      title: 'Courses',
      isCourses: true,
    }
  );
});

app.get('/add-course', (req, res) => {
  res.render(
    'add-course',
    {
      title: 'Add course',
      isAdd: true,
    }
  );
});

//server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `Server is running on port ${PORT}`
})