// Auth middleware — protects routes that require a logged in user
// Checks if a userId exists in the session (set during login)
// If not logged in, redirects to the login page
// If logged in, calls next() to continue to the requested route
module.exports = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};
