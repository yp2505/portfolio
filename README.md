## Portfolio

This is a Next.js portfolio that can be deployed to Vercel or any Node.js host.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production deployment

Run `npm run build` before deploying. Configure the following environment variables in your deployment provider (for example, Vercel):

| Variable | Required for | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | AI chat | Keep private. |
| `NOTION_API_KEY` | Dynamic projects | Keep private. |
| `NOTION_DATABASE_ID` | Dynamic projects | Keep private. |

Copy `.env.example` to `.env.local` for local development. Do not commit `.env.local` or production secrets.

The interactive Portfolio OS at `/os` is part of this Next.js application. It runs on the same Vercel deployment and does not need a separate server or API key.

Deploy the repository in Vercel with the framework preset set to Next.js. The build command is `npm run build`.
