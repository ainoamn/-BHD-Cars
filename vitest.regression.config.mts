import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Isolated known-gap regressions — not part of the default CI gate. */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/regression/**/*.test.ts"],
    reporters: ["default"],
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
});
