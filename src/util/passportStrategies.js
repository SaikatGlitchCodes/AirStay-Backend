var passport = require('passport');
var MagicLinkStrategy = require('passport-magic-link').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // Replace with your user fetching logic
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

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
    console.log('Sent magic link to ' + user.email, ' with link:', link);
    return (msg);
}, function verify(user, done) {
    // Add your user verification logic here
    // For example, you can check if the user exists in your database
    return user;
}));

passport.use(new GoogleStrategy({
    clientID: '321761631526-o38akcuh0v3mi7i5qgk4bpfou9lusnal.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/"
},
    function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        return profile;
    }
));

passport.use(new GoogleOneTapStrategy(
    {
        clientID: '321761631526-o38akcuh0v3mi7i5qgk4bpfou9lusnal.apps.googleusercontent.com', // your google client ID
        clientSecret: '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', // your google client secret
        verifyCsrfToken: false, // whether to validate the csrf token or not
    },
    function (profile, done) {
        // Here your app code, for example:
        return profile;
    }
)
);

module.exports = passport;