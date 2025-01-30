import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

import viteBaseConfig from "../vite.config";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // .env inside of packages/platform/atoms
  return {
    ...viteBaseConfig,
    plugins: [react(), EnvironmentPlugin([])],
    define: {
      "process.env": env,
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "Cal",
        fileName: (format) => `Cal.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
        output: {
          exports: "named",
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  };
});
