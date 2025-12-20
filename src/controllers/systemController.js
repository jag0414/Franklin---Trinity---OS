const os = require('os');

// Get system status
exports.getStatus = async (req, res, next) => {
  try {
    const status = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
      },
      process: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      }
    };

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};

// Get system info
exports.getInfo = async (req, res, next) => {
  try {
    const info = {
      platform: os.platform(),
      architecture: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV
    };

    res.status(200).json({
      success: true,
      data: info
    });
  } catch (error) {
    next(error);
  }
};
