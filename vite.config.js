import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base must match the GitHub repo name so assets resolve correctly
// once hosted at https://VenukIndrapala.github.io/VallibelOne/
export default defineConfig({
  plugins: [react()],
  base: "/VallibelOne/",
});
