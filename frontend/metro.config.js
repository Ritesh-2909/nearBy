const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path alias support
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

// Configure NativeWind to process CSS
// NativeWind v4 automatically handles CSS processing
module.exports = withNativeWind(config, { 
  input: './global.css',
});
