const express = require('express');
const cors = require('cors');
const winston = require('winston');
const apiRoutes = require('./routes/api');
require('dotenv').config();
console.log(process.env.DB_HOST); // 'localhost'


const app = express();
const PORT = 3000;

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
        new winston.transports.Console(),
    ],
});

app.use(cors());
app.use(express.json());

// Use the API routes
app.use('/api', apiRoutes);

// Start the server and handle uncaught exceptions
const server = app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

// Restart the application automatically on uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err.message);
    pm2.restart('node-api'); // Updated to match PM2 app name
    // server.close(() => {
    //     process.exit(1); // Exit the process after logging
    // });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    pm2.restart('node-api'); // Updated to match PM2 app name
    // logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // server.close(() => {
    //     process.exit(1); // Exit the process after logging
    // });
});
