const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());
app.get('/', (_, res) => res.json({ message: 'pong' }))

// Import routes
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const openRequestTransactionRoutes = require('./routes/openRequestTransaction');

// Use routes
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/subjects', subjectRoutes);
app.use('/open_requests', openRequestTransactionRoutes);
// Sync database and start server

app.listen(port, () => {
    console.log('Server is running on port ', port);
});
