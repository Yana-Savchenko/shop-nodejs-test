const Router = require('express');

const Course = require('../models/course');

const router = Router();

router.get('/', async (req, res) => {
  // const { courses, price } = await Cart.fetch();

  // res.render('cart',
  //   {
  //     isCart: true,
  //     title: 'Cart',
  //     courses,
  //     price,
  //   }
  // )
  res.json({ test: true });
})

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect('/cart');
})

router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
})


module.exports = router;