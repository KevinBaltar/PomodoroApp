const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  'metro-react-native-babel-transformer'
);

// Permite importar módulos .mjs e outros
config.resolver.sourceExts = ['js', 'jsx', 'json', 'mjs'];

module.exports = config;