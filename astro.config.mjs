import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Fully static build (the default). No SSR adapter — deploys as-is to Vercel/Netlify.
  output: 'static',
  // Set this to your deployed origin so absolute URLs / sitemaps are correct.
  site: 'https://supreme-court-today.example.com',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
