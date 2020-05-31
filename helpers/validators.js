const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.regValidators = [
  body('email')
    .isEmail().withMessage('Enter valid email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject(`Email ${value} already in use`);
        }
      } catch (err) {
        console.log(err);
      }
    }),
  body('password', 'Min password length is 6 symbols')
    .isLength({ min: 6, max: 36 })
    .isAlphanumeric()
    .trim(),
  body('confirmPass')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Min name length is 6 symbols')
    .trim(),
]

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Enter valid email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject(`User ${value} does not exist!`);
        }
      } catch (err) {
        console.log(err);
      }
    }),
  body('password')
    .trim()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: req.body.email });
        const isValidPass = await bcrypt.compare(value, user.password);

        if (!isValidPass) {
          return Promise.reject(`Invalid password`);
        }

        return true;
      } catch (err) {
        console.log(err);
      }
    }),
]

exports.courseValidators = [
  body('title').isLength({ min: 3 }).withMessage('Min length of course name is 3 symbols'),
  body('price').isNumeric().withMessage('Enter valid price'),
  body('img').isURL().withMessage('Enter valid URL'),
]