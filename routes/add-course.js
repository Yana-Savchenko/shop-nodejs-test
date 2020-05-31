const { Router } = require('express');
const { validationResult } = require('express-validator');

const Course = require('../schemas/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../helpers/validators');

const router = Router();

router.get('/', auth, (req, res) => {
  res.render(
    'add-course',
    {
      title: 'Add course',
      isAdd: true,
    }
  );
});

router.post('/', auth, courseValidators, async (req, res) => {
  const { title, price, img } = { ...req.body };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render(
      'add-course',
      {
        title: 'Add course',
        isAdd: true,
        courseError: errors.array()[0].msg,
        data: {
          title,
          price,
          img,
        }
      });
  }

  const course = new Course({
    title,
    price,
    img,
    userId: req.user
  })

  try {
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }

})

module.exports = router; 