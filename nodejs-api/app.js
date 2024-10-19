const express = require('express');
const cors = require('cors');
const winston = require('winston');
const pm2 = require('pm2');
const apiRoutes = require('./routes/api');  // Updated to reference the routes directory

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console()
    ],
});

// Use the API routes
app.use('/api', apiRoutes);

// Start the server and handle uncaught exceptions
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Restart the application automatically on uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err.message);
    pm2.restart('node-api'); // Updated to match PM2 app name
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    pm2.restart('node-api'); // Updated to match PM2 app name
});
