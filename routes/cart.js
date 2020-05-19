const Router = require('express');

const Course = require('../models/course');
const Cart= require('../models/cart');

const router = Router();

router.get('/', async (req, res) => {
  // const cart = await Cart.fetch();
  const {courses, price} = await Cart.fetch();  
  
  console.log('courses', courses);
  
  res.render('cart',
    {
      isCart: true,
      title: 'Cart',
      courses,
      price,
    }
  )
})

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);

  await Cart.addCourse(course);

  res.redirect('/cart');
})

module.exports = router;