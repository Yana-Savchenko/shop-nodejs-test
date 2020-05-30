module.exports = function (email, token) {
  return {
    from: 'y.s.13.06.10@gmail.com',
    to: email,
    subject: 'Reset password',
    html: `
      <h3>Request for reset password for ${email}</h3>
      <p>If you did not make this request, ignore this letter</p>
      <p>Otherwise click on the link bellow</p>
      <p><a href="${process.env.BASE_URL}/auth/reset-pass/${token}">Reset password</a></p>
      <hr/>
      <a href="${process.env.BASE_URL}">Courses shop</a>
    `
  }
}