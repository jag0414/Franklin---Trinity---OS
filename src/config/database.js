const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    // No options needed - useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
    await mongoose.connect(config.database.uri);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
