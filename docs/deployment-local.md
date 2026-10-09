# Install, build & run (self-hosted)

## Requirements
Node.js ≥ 20.9 (22 LTS recommended), MySQL 8+, ~1 GB RAM.

## 1. MySQL
```sql
CREATE DATABASE propertyinspectors CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pi_user'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON propertyinspectors.* TO 'pi_user'@'localhost';
FLUSH PRIVILEGES;
```
`prisma migrate dev` also needs a temporary *shadow database*. Either grant `CREATE, DROP ON *.*` to `pi_user` on your dev machine, or use `npm run db:push` in development (no migration files).

## 2. Environment
```bash
cp .env.example .env
# DATABASE_URL, AUTH_SECRET (openssl rand -base64 48), ADMIN_EMAIL/PASSWORD, SMTP_*, GTM/GA IDs
```

## 3. First run
```bash
npm install
npx prisma migrate dev --name init   # first time (creates prisma/migrations)
npm run db:seed
npm run dev
```

## 4. Production
```bash
npm run db:deploy      # apply migrations
npm run build
npm start              # PORT=3000 by default
```
Keep it running with PM2: `pm2 start npm --name pi -- start` · `pm2 save`.
Put Nginx/Caddy in front for HTTPS on `propertyinspectors.me` (proxy to `localhost:3000`, pass `X-Forwarded-For`).

## Backups
- MySQL: `mysqldump propertyinspectors > backup.sql` (daily).
- Uploaded images: `storage/uploads/` (`UPLOAD_DIR`).
- Site images and PDFs (`public/images/`, `public/downloads/`) are in git — no backup needed.
