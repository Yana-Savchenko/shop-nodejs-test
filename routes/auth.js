const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const regMail = require('../email/register');
const resetPassEmail = require('../email/resetPass');
const { regValidators, loginValidators } = require('../helpers/validators');

const router = Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    type: "login",
    user: 'y.s.13.06.10@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

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

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login');
    }

    const user = await User.findOne({ email });

    req.session.user = user;
    req.session.isAuth = true;

    req.session.save(err => {
      if (err) { throw err }

      res.redirect('/');
    })
  }
  catch (err) {
    console.log(err);
  }
})

router.post('/register', regValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('regError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, +process.env.SALT);

    const user = new User({
      email, name, password: hashPassword, cart: { items: [] }
    });
    await user.save();
    res.redirect('/auth/login');

    const mailOptions = regMail(email);

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }

})

router.get('/reset-pass', (req, res) => {
  res.render('auth/reset-pass', {
    title: 'Forgot password',
    resetPassError: req.flash('resetPassError'),
  })
})

router.post('/reset-pass', async (req, res) => {

  const { email } = { ...req.body };

  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('resetPassError', 'Something went wrong, try again later');
        return res.redirect('/auth/reset');
      }
      const token = buffer.toString('hex');
      const user = await User.findOne({ email: email });

      if (user) {
        user.resetToken = token;
        user.resetTokenExp = Date.now() + 3600 * 1000;
        await user.save();
        const mailOptions = resetPassEmail(email, token);
        res.redirect('/auth/login');
        await transporter.sendMail(mailOptions);
      } else {
        req.flash('resetPassError', `User ${email} does not exist`);
        return res.redirect('/auth/reset-pass');
      }

    })
  } catch (err) {
    console.log(err);
  }
})

router.get('/reset-pass/:token', async (req, res) => {
  const { token } = { ...req.params };

  if (!token) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render('auth/set-pass', {
      title: 'Set new password',
      resetPassError: req.flash('setPassError'),
      userId: user._id.toString(),
      token,
    })
  } catch (err) {
    console.log(err);
  }
})

router.post('/set-pass', async (req, res) => {
  const { token, password } = { ...req.body };
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (user) {
      user.password = await bcrypt.hash(password, +process.env.SALT);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;

      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Token expired');
      res.redirect('/auth/login');
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;