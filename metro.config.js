const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Override the resolver to handle the TerminalReporter issue
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  alias: {
    // Skip problematic Metro internal modules
    './src/lib/TerminalReporter': false,
  },
  blacklistRE: /.*\/src\/lib\/TerminalReporter.*/,
};

module.exports = config;