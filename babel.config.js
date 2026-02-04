module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@/navigation": "./src/navigation",
            "@/screens": "./src/screens",
            "@/components": "./src/components",
            "@/hooks": "./src/hooks",
            "@/utils": "./src/utils",
            "@/types": "./src/types",
          },
        },
      ],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
