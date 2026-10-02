import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "server-only" throws outside the React Server bundle; it is a no-op in tests
      "server-only": path.resolve(__dirname, "tests/stubs/empty.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    env: { AUTH_SECRET: "test-secret-that-is-at-least-32-characters-long", NEXT_PUBLIC_SITE_URL: "https://propertyinspectors.me" },
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/middleware.ts", "src/app/api/**"],
      // db.ts = Prisma singleton, track.ts = browser-only dataLayer/gtag
      exclude: ["src/lib/db.ts", "src/lib/track.ts"],
      thresholds: { lines: 85, functions: 85, branches: 80, statements: 85 },
    },
  },
});
