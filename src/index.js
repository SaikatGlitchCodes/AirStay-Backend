const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const passport = require('passport');
const session = require('express-session');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

app.use(cors())
app.use(express.json());
app.get('/', (_, res) => res.json({ message: 'pong' }));

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Dummy user storage
let users = [];

// Passport local strategy
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false);
    if (user.password !== password) return done(null, false);
    return done(null, user);
}));

// Passport Google strategy
passport.use(new GoogleStrategy({
    clientID: '321761631526-q7pf82m4skftp38jnf5k7aj2rqb0pjpl.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    // Check if user already exists in your DB
    const user = users.find(u => u.googleId === profile.id);
    if (user) return done(null, user);
    // Otherwise, create a new user
    const newUser = { googleId: profile.id, username: profile.displayName };
    users.push(newUser);
    return done(null, newUser);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Import routes
const userRoutes = require('./routes/RequestRoute/userRoutes');
const requestRoutes = require('./routes/RequestRoute/requestRoutes');
const subjectRoutes = require('./routes/RequestRoute/subjectRoutes');
const openRequestTransactionRoutes = require('./routes/RequestRoute/openRequestTransaction');
const magicLink = require('./routes/AuthenticationRoute/magicLink.auth')
// Request Routes
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/subjects', subjectRoutes);
app.use('/open_requests', openRequestTransactionRoutes);

// Authentication Routes
app.use('/auth',magicLink );
app.listen(port, function () { console.log(`Connected to ${port}`) });
