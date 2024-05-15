require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/task');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Define Routes
app.use('/task', taskRoutes);
app.use('/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
});

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
