const Router = require('express');

const Course = require('../models/course');
const Cart= require('../models/cart');

const router = Router();

router.get('/', async (req, res) => {
  const cart = Cart.fetch();
  res.render('cart',
    {
      isCart: true,
      title: 'Cart',
      cart,
    }
  )
})

router.post('/add', async (req, res) => {
  const course = Course.getById(req.body.id);

  await Cart.addCourse(course);

  res.redirect('/cart');
})

module.exports = router;