const { Router } = require('express');

const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
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
      const isValidPass = password === user.password;
      if (isValidPass) {
        req.session.user = user;
        req.session.isAuth = true;

        req.session.save(err => {
          if (err) { throw err }

          res.redirect('/');
        })
      } else {
        res.redirect('/auth/login');
      }
    } else {
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
      res.redirect('/auth/login#register')
    } else {
      const user = new User({
        email, name, password, cart: { items: [] }
      });
      await user.save();
      res.redirect('/auth/login');
    }
  } catch (err) {
    console.log(err);
  }

})

module.exports = router;