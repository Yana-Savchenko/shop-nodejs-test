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
  const user = await User.findById('5ecaa6cc6c3fc64666032e13');

  req.session.user = user;
  req.session.isAuth = true;

  req.session.save(err => {
    if (err) { throw err }

    res.redirect('/');
  })
})

module.exports = router;