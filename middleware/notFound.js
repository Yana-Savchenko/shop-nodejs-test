module.exports = function (req, res, next) {
  res.status(404).render('not-found', {
    title: 'Page not found',
  })
} 