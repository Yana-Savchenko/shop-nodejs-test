const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const homeRoutes = require('./routes/home');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/add-course');
const User = require('./models/user');

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Handlebars settings
app.engine('hbs', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Add temp user to req
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5eca6df831e0552540b64445');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
})

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
    const url = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0-qa9lw.mongodb.net/${process.env.DB_NAME}`;

    await mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: 'test.mail.ru',
        name: 'Yana',
        cart: { items: [] }
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (err) {
    console.log('error:', err);
  }
}

start();
