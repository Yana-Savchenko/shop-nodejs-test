const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const homeRoutes = require('./routes/home');
const cartRoutes = require('./routes/cart');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/add-course');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

dotenv.config();
const app = express();
const mongoDB_url = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0-qa9lw.mongodb.net/${process.env.DB_NAME}`;
const store = new MongoStore({
  collection: 'sessions',
  uri: mongoDB_url,
});

//App settings
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret string',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varMiddleware);
app.use(userMiddleware);


// Handlebars settings
app.engine('hbs', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'views');


//routes
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add-course', addCourseRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

//start server and connect to DB
async function start() {
  try {
    const PORT = process.env.PORT || 3000;

    await mongoose.connect(mongoDB_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (err) {
    console.log('error:', err);
  }
}

start();
