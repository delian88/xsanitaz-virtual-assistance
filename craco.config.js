const path = require("path");

module.exports = {
  webpack: {
    resolve: {
      fallback: {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
      },
    },
  },
};
