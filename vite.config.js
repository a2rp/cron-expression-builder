import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/cron-expression-builder/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
