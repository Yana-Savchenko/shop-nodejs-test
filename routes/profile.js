const { Router } = require('express');

const auth = require('../middleware/auth');
const User = require('../schemas/user');

const router = Router();

router.get('/', auth, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    user: req.user.toObject(),
  })
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const changes = {
      name: req.body.name,
    }

    if (req.file) {
      changes.avatarUrl = req.file.path;
    }

    Object.assign(user, changes);
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.log(err);
  }
})
module.exports = router;