import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
  webpack: {
    resolve: {
      fallback: {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
      },
    },
  },
};
