const { Router } = require('express');
const { validationResult } = require('express-validator');

const Course = require('../schemas/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../helpers/validators');

const router = Router();

function isAuthor(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('userId', '_id name email')

    const userId = req.user ? req.user._id.toString() : null;
    res.render(
      'courses',
      {
        title: 'Courses',
        isCourses: true,
        userId,
        courses,
      }
    );
  } catch (err) {
    console.log(err);
  }

});
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render(
      'course',
      {
        layout: 'empty',
        title: course.title,
        course
      }
    );
  } catch (err) {
    console.log(er);
  }

});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }
  try {
    const course = await Course.findById(req.params.id);

    if (!isAuthor(course, req)) {
      return res.redirect('/courses');
    }
    res.render(
      'edit-course',
      {
        title: `Edit ${course.title}`,
        course,
        courseError: req.flash('courseError'),
      }
    );
  } catch (err) {
    console.log(err);
  }

});

router.post('/edit', auth, courseValidators, async (req, res) => {
  const { id } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('courseError', errors.array()[0].msg);
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }
  try {
    const course = await Course.findById(id);

    if (!isAuthor(course, req)) {
      res.redirect('/courses');
    }
    Object.assign(course, req.body);
    await (await course).save();

    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
})

router.post('/remove', auth, async (req, res) => {
  const { id } = req.body;
  try {
    await Course.deleteOne({
      _id: id,
      userId: req.user._id,
    });
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
})

module.exports = router; 