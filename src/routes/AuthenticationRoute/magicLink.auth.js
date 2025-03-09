const express = require('express');
const router = express.Router();
const passport = require('../../util/passportStrategies')

router.get('/magic-link', passport.authenticate('magiclink', {
    action: 'requestToken',
    failureRedirect: '/login'
}), function (req, res, next) {
    res.redirect('/login/email/check');
});
router.get('/login/email/check', function (req, res, next) {
    res.render('login/email/check');
});
router.get('/login/email/verify', passport.authenticate('magiclink', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));
module.exports = router;