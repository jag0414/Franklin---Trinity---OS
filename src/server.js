require('dotenv').config();
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/database');

const PORT = config.port;

// Connect to database before starting server
const startServer = async () => {
  try {
    // Initialize database connection
    await connectDB();
    
    // Start server only after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Franklin Trinity OS Backend Server`);
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${config.env}`);
      console.log(`📝 API Docs available at http://localhost:${PORT}/api/docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n🛑 Received shutdown signal. Closing server gracefully...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = startServer;
