const Router = require('express');

const Course = require('../models/course');
const Card = require('../models/card');

const router = Router();

router.get('/', async (req, res) => {
  const card = Card.fetch();
  res.render('card',
    {
      isCard: true,
      title: 'Cart',
      card,
    }
  )
})

router.post('add', async (req, res) => {
  const course = Course.getById(req.body.id);

  await Card.addCourse(course);

  res.redirect('/card');
})

module.exports = router;