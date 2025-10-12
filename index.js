const express = require('express');
const mongoose = require('mongoose');

const app = express();

// middleware to parse JSON bodies
app.use(express.json());

// connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/employee_management_db';

// mongoose connection
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// test route
app.get('/', (req, res) => {
    res.send('Employee Management API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// import routes
// const userRoutes = require('./routes/userRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');