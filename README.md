# Aleha Animates

Portfolio site for Alejandro Martín, built with React, Vite, Tailwind CSS, and MDX.

## Local development

```sh
npm ci
npm run dev
```

## Validation

```sh
npm test
npm run build
```

## Deployment

Cloudflare Workers Builds watches the `main` branch. Each push runs the production build and deploys the generated `dist/` directory as static assets. Deployment settings live in [`wrangler.jsonc`](./wrangler.jsonc).

GitHub stores the source only; generated build output is intentionally not committed.
