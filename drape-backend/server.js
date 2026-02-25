require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/database');
const logger = require('./src/config/logger');

require('./src/jobs/notificationWorker');
require('./src/jobs/productTaggingWorker');
require('./src/jobs/payoutCalculationWorker');
require('./src/jobs/outfitDetectionWorker');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
      }
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
