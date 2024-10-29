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

// Request Routes
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/subjects', subjectRoutes);
app.use('/open_requests', openRequestTransactionRoutes);

// Authentication Routes


// Email Authentication Route
app.post('/auth/email', (req, res) => {
    const { username, password } = req.body;
    passport.authenticate('local', (err, user) => {
        if (err) return res.status(500).json({ error: 'Internal error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login error' });
            return res.json({ message: 'Logged in successfully', user });
        });
    })(req, res);
});

// Gmail Authentication Route
app.get('auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// OTP Generation and Sending
app.post('/auth/otp', (req, res) => {
    const secret = speakeasy.generateSecret({ length: 10 });
    // Store this secret in your user database
    const user = { email: req.body.email, secret: secret.base32 };
    users.push(user); // For example purpose, add to array
    const otpa = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

    // Send OTP via email (set up your transporter)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'saikatodev@gmail.com',
            pass: 'saikat@123'
        }
    });

    const mailOptions = {
        from: 'saikatodev@gmail.com',
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otpa}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ error: 'Error sending OTP' });
        res.json({ message: 'OTP sent' });
    });
});

// OTP Verification Route
app.post('/auth/verify-otp', (req, res) => {
    const { email, token } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(401).json({ error: 'User not found' });

    const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: token
    });

    if (verified) {
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login error' });
            return res.json({ message: 'Logged in successfully', user });
        });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
});

app.listen(port, function () { console.log(`Connected to ${port}`) });
