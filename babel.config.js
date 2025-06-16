// babel.config.js
// This file is usually not needed for Next.js projects that use SWC (Speedy Web Compiler) by default.
// Next.js handles Babel configuration internally if you have a .babelrc or babel.config.js for specific needs.
// However, if you require custom Babel plugins or presets (e.g., for Jest transforms if not using SWC with Jest,
// or for specific library compatibility), you can define them here.

module.exports = {
  presets: [
    // 'next/babel' is the default preset for Next.js projects if you need Babel.
    // It includes everything you need for React, TypeScript, and modern JavaScript.
    'next/babel',
  ],
  plugins: [
    // Add custom Babel plugins here if necessary
    // Example:
    // "babel-plugin-macros",
    // ["@babel/plugin-proposal-decorators", { "legacy": true }],
    // ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ],
};

// console.log("Babel configuration (babel.config.js) loaded. Note: Next.js uses SWC by default.");
