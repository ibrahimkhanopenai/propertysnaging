# propertyinspectors.me — Next.js

UAE property snagging website + blog CMS. Next.js 15 · TypeScript · Tailwind v4 · MySQL (Prisma) · EN/AR.

**Developers & AI agents: start with [AGENTS.md](./AGENTS.md).**

## Quick start
```bash
cp .env.example .env          # fill DATABASE_URL, AUTH_SECRET, SMTP…
npm install
npm run db:migrate            # creates tables
npm run db:seed               # creates the admin user
npm run assets:download       # images + PDFs from the current WordPress site
npm run wp:import             # (optional) import WordPress blog posts
npm run dev                   # http://localhost:3000  · admin: /admin/
```
Production: `npm run build && npm start` — full guide in `docs/deployment-local.md`.
