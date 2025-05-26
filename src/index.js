const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (_, res) => res.json({ message: 'pong' }));

// Import routes
const userRoutes = require('./routes/RequestRoute/userRoutes');
const requestRoutes = require('./routes/RequestRoute/requestRoutes');
const subjectRoutes = require('./routes/RequestRoute/subjectRoutes');
const openRequestTransactionRoutes = require('./routes/RequestRoute/openRequestTransaction');

app.use('/users', userRoutes);
app.use('/requests' , requestRoutes);
app.use('/subjects' , subjectRoutes);
app.use('/open_requests' , openRequestTransactionRoutes);


app.listen(port, function () { console.log(`Connected to ${port}`) });
