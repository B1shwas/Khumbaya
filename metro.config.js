const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  resolver: {
    blockList: [/@expo\/ui_tmp_/],
  },
});

module.exports = withNativeWind(config, { input: "./app/global.css" });
