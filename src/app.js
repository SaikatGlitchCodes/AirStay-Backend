// app.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.json({ message: 'pong' }));

const userRoutes = require('./routes/RequestRoute/userRoutes');
const requestRoutes = require('./routes/RequestRoute/requestRoutes');
const subjectRoutes = require('./routes/RequestRoute/subjectRoutes');
const openRequestTransactionRoutes = require('./routes/RequestRoute/openRequestTransaction');

app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/subjects', subjectRoutes);
app.use('/open_requests', openRequestTransactionRoutes);

module.exports = app;
