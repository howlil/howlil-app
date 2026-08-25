// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

const repoName = "howlil-app";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const site =
  process.env.SITE_URL ??
  (isGitHubPages ? "https://howlil.github.io" : "https://howlil.tech");
const base =
  process.env.BASE_PATH ?? (isGitHubPages ? `/${repoName}` : "/");

export default defineConfig({
  output: "static",
  site,
  base,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), mdx()],
});
