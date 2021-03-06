const User = require('../schemas/user');

module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  req.user = await User.findById(req.session.user._id);
  req.user.id = req.user._id;
  
  next();
}