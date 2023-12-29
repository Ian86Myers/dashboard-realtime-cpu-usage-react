// const path = require("path");

// module.exports = {
//   entry: "./src/index.js",
//   output: {
//     filename: "bundle.js",
//     path: path.resolve(__dirname, "dist"),
//   },
//   mode: "development",
//   resolve: {
//     fallback: {
//       http: require.resolve("stream-http"),
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//     ],
//   },
//   // ... other webpack configurations
// };
