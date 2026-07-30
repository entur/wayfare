const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const canonicalAssetRoot = path.resolve(__dirname, "../tanstack-start/public");

config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer/expo");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (extension) => extension !== "svg",
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];
config.watchFolders = [...(config.watchFolders ?? []), canonicalAssetRoot];

module.exports = config;
