const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);

["jpg", "png"].forEach((ext) => {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
});
if (!config.resolver.sourceExts.includes("svg")) {
  config.resolver.sourceExts.push("svg");
}

module.exports = config;
