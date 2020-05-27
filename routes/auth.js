const { Router } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    regError: req.flash('regError'),
    loginError: req.flash('loginError'),
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  })
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isValidPass = await bcrypt.compare(password, user.password);

      if (isValidPass) {
        req.session.user = user;
        req.session.isAuth = true;

        req.session.save(err => {
          if (err) { throw err }

          res.redirect('/');
        })
      } else {
        req.flash('loginError', 'Invalid password')
        res.redirect('/auth/login');
      }

    } else {
      req.flash('loginError', `User ${email} does not exist`);
      res.redirect('/auth/login');
    }

  } catch (err) {
    console.log(err);
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('regError', `Email ${email} already in use`);
      res.redirect('/auth/login#register')
    } else {

      const hashPassword = await bcrypt.hash(password, +process.env.SALT);

      const user = new User({
        email, name, password: hashPassword, cart: { items: [] }
      });
      await user.save();
      res.redirect('/auth/login');
    }
  } catch (err) {
    console.log(err);
  }

})

module.exports = router;