const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.get('/', (_, res) => res.json({ message: 'pong' }))


// Import routes
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);

// Sync database and start server

app.listen(port, () => {
    console.log('Server is running on port ', port);
});
