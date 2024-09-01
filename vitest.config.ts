/// <reference types="vitest" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    environmentMatchGlobs: [
      // all component tests will run in happy-dom
      ["**/?(*.)+(spec|test).[jt]sx", "happy-dom"],
      // all function tests will run in node
      ["**/?(*.)+(spec|test).[jt]s", "node"],
    ],
    coverage: {
      provider: "v8",
      reporter: ["clover", "json", "lcov", "text", "json-summary"],
    },
  },
});
