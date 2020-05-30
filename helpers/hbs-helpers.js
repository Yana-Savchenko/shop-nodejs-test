module.exports = {
  isAuthor(a, b, options) {
    a = a.toString();
    b = b.toString();
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  }
}