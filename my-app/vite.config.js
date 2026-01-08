import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Import data for injection
import { PROFILE, PRIVATE_REEL } from './src/data/profile.js';

// Generate HTML for noscript
const noscriptHtml = `
  <style>
    body {
      margin: 0;
      background: white;
      color: #1a1a1a;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .ns-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 24px;
      text-align: left;
    }
    
    .ns-header {
      font-size: 80px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 0.9;
      margin: 0 0 60px 0;
      color: black;
      letter-spacing: -2px;
    }

    .ns-title {
      font-size: 40px;
      font-weight: 300;
      margin: 0 0 32px 0;
      line-height: 1.1;
      color: black;
      border-bottom: 4px solid black;
      padding-bottom: 16px;
      display: inline-block;
    }

    .ns-text {
      font-size: 20px;
      line-height: 1.6;
      margin-bottom: 24px;
      color: #4b5563;
    }

    .ns-buttons {
      display: flex;
      gap: 20px;
      margin-top: 56px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .ns-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 20px 40px;
      background: white;
      border: 2px solid black;
      color: black;
      text-decoration: none;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 4px 4px 0 0 black;
      transition: all 0.2s;
      text-transform: uppercase;
    }

    .ns-btn:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 0 black;
    }

    @media (max-width: 768px) {
      .ns-header { font-size: 48px; margin-bottom: 40px; }
      .ns-title { font-size: 32px; }
      .ns-buttons { flex-direction: column; }
      .ns-btn { width: 100%; box-sizing: border-box; }
    }
  </style>
  <div class="ns-container">
    <h1 class="ns-header">${PROFILE.name}</h1>
    <h2 class="ns-title">About</h2>
    ${PROFILE.bio.map(p => `<p class="ns-text">${p}</p>`).join('')}
    
    <div class="ns-buttons">
      <a href="${PROFILE.links.cv}" class="ns-btn" target="_blank">CV</a>
      <a href="${PROFILE.links.linkedin}" class="ns-btn" target="_blank">LinkedIn</a>
      <a href="${PRIVATE_REEL.url}" class="ns-btn" target="_blank">Reel</a>
    </div>
  </div>
`;

const noscriptPlugin = () => {
  return {
    name: 'html-noscript-injection',
    transformIndexHtml(html) {
      return html.replace(
        /<noscript>(.*?)<\/noscript>/s,
        `<noscript>${noscriptHtml}</noscript>`
      )
    }
  }
}

export default defineConfig({
  plugins: [react(), noscriptPlugin()],
  base: '/', // User page typically served at root
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
});
