# GameVault

GameVault is a React app built with Vite. User settings and edits are stored in browser localStorage. GitHub Pages deployment is configured in `.github/workflows/deploy.yml`.

## Run locally

Prerequisite: Node.js 22 or newer.

1. Install dependencies with `npm install`.
2. Start the app and its local API with `npm run dev`.
3. Build the static frontend with `npm run build`; Vite writes files to `dist/`.

The optional Gemini server reads `GEMINI_API_KEY` from the environment. Put local credentials in an untracked `.env.local` file. Never commit API keys or other secrets. GitHub Pages hosts the static frontend; the Express API requires a separate server deployment.

## AI Studio

The original AI Studio project: https://ai.studio/apps/ed72552d-c865-4faa-ae82-fbaa0b95b644
