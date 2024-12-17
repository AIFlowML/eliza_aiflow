import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],
    external: [
        "pg",
        "pg-pool",
        "pg-format",
        "@ai16z/eliza",
        "fs",
        "path"
    ]
});
