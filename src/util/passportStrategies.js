var passport = require('passport');
var MagicLinkStrategy = require('passport-magic-link').Strategy;

passport.use(new MagicLinkStrategy({
    secret: 'keyboard cat',
    userFields: ['email'],
    tokenField: 'token',
    verifyUserAfterToken: true
}, function send(user, token) {
    var link = 'http://localhost:3000/login/email/verify?token=' + token;
    var msg = {
        to: user.email,
        from: process.env['EMAIL'],
        subject: 'Sign in to Todos',
        text: 'Hello! Click the link below to finish signing in to Todos.\r\n\r\n' + link,
        html: '<h3>Hello!</h3><p>Click the link below to finish signing in to Todos.</p><p><a href="' + link + '">Sign in</a></p>',
    };
    console.log('Sent magic link to ' + user.email,' with link:', link);
    return (msg);
}, function verify(user) {
    return user;
}));

module.exports = passport;