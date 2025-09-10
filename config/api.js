// config/api.js - Updated with device switching capability

// Device configuration
const DEVICE_TYPE = {
  PC: 'pc',
  LAPTOP: 'laptop'
};

// Set this manually based on which device you're using
const CURRENT_DEVICE = DEVICE_TYPE.LAPTOP; // Change to DEVICE_TYPE.PC when working on PC

// API URLs for different devices
const API_CONFIGS = {
  [DEVICE_TYPE.PC]: 'http://192.168.100.6:5000',      // Your PC IP (.6)
  [DEVICE_TYPE.LAPTOP]: 'http://192.168.100.67:5000'  // Your laptop IP (.67)
};

// Get current API URL based on device
const API_URL = API_CONFIGS[CURRENT_DEVICE];

// Log current configuration (helpful for debugging)
console.log(`=== API Config ===`);
console.log(`Current Device: ${CURRENT_DEVICE}`);
console.log(`API URL: ${API_URL}`);
console.log(`==================`);

export default API_URL;