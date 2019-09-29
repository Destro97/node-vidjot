module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorised. Please login to continue');
        res.redirect('/users/login');
    }
}