module.exports = function (email) {
  return {
    from: 'y.s.13.06.10@gmail.com',
    to: email,
    subject: 'Invoices due',
    html: `
      <h1>Registration completed successfully</h1>
      <p>Your login for site is ${email}
      <hr/>
      <a href="${process.env.BASE_URL}">Let's start</a>
    `
  }
}