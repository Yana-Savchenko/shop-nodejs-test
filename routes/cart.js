const Router = require('express');

const Course = require('../models/course');

const router = Router();

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);
  const price = calcPrice(courses);

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
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect('/cart');
})

router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
})

function mapCartItems(cart) {
  return cart.items.map(item => ({
    ...item.courseId._doc,
    count: item.count,
  }))
}

function calcPrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count;
  }, 0)
}

module.exports = router;