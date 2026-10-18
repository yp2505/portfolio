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
| `NEXT_PUBLIC_OSJS_ORIGIN` | Portfolio OS | The public HTTPS origin of a separately deployed OS.js app. |

Copy `.env.example` to `.env.local` for local development. Do not commit `.env.local` or production secrets.

If `NEXT_PUBLIC_OSJS_ORIGIN` is missing, invalid, or points to `localhost` in a production build, `/os` remains safely available but shows an unavailable state. A deployed visitor can never reach an OS.js server running on your computer.

Deploy the repository in Vercel with the framework preset set to Next.js. The build command is `npm run build`.
