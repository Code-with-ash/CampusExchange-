# Deployment

The frontend and Express API are separate projects. Deploy them as separate Vercel
projects from this repository; do not point the frontend at a localhost URL in
production.

## Backend (Vercel)

1. Create a Vercel project with the repository root directory set to `backend`.
2. Use Node.js and the `npm` package manager. The `vercel-build` script generates
   the Prisma client.
3. Add the variables from [`backend/.env.example`](./backend/.env.example) in
   Vercel Project Settings. Use a long, randomly generated `JWT_SECRET`.
   `DATABASE_URL` should use the database provider's pooled connection URL;
   `DIRECT_URL` should use its direct connection URL. Restrict
   `FRONTEND_ORIGINS` to the exact deployed frontend origin(s), comma-separated.
4. Apply the checked-in migration before serving traffic: from `backend`, run
   `npx prisma migrate deploy` against the production database. For an existing
   database, first verify its schema matches this initial migration, then
   baseline it once with
   `npx prisma migrate resolve --applied 20261011195000_initial_schema`.
   Never baseline a mismatched schema or run `db push` against production data.
5. Deploy and check `https://<backend-domain>/api/health`. A healthy response
   includes `"database":"connected"`.

The API is an exported Express application so Vercel can run it as a function;
`npm start` remains available for a persistent Node.js host and local use.

## Frontend (Vercel)

1. Create a second Vercel project for the same repository with the root directory
   set to `frontend`. Use the default Next.js build and output settings.
2. Set `NEXT_PUBLIC_API_URL` to the backend's HTTPS origin, for example
   `https://<backend-domain>`. Set it before building; the value is embedded in
   the client bundle.
3. Add the frontend's production origin to the backend's `FRONTEND_ORIGINS`, then
   redeploy the backend if needed.
4. Test sign-up/OTP, login, loading and publishing listings, and editing/deleting
   the signed-in user's listings against the deployed projects.

## Troubleshooting database connection errors

If Prisma reports `P1001` or `Can't reach database server`, copy fresh
connection strings from **Supabase Dashboard → Project → Connect**; do not
assemble the host, region, username, or project reference manually. For this
Vercel/serverless backend, use the **Transaction pooler** URL (port `6543`) for
`DATABASE_URL`. Use the matching project's **Session pooler** URL (port `5432`)
or supported **Direct connection** URL for `DIRECT_URL`.

Confirm the Supabase project is present and active, and that the project
reference in `SUPABASE_URL` and the database connection strings is the one shown
in that project's dashboard. Check that the project URL hostname resolves in
DNS. Update all affected variables in the Vercel backend project's Production
environment (and Preview if needed), then redeploy the backend. Verify
`/api/health` reports `"database":"connected"` before testing listing routes.
If the project is active and the copied URLs still fail, check Supabase database
network restrictions and project status; changing Prisma queries will not fix
an unreachable or inactive database.

## Capacity and operations

The app uses PostgreSQL and Supabase Storage, not local disk, for persistent
data and images, and listing reads are paginated. This is a reasonable starting
point for around 1,000 registered users, but it is not a guarantee for 1,000
simultaneous users: that depends on the database connection pool/plan, Vercel
function limits, external SMS/AI quotas, and traffic patterns. The current
rate-limit counters are in process memory, so they are not shared between
serverless instances; configure a shared rate-limit store before relying on them
for abuse prevention at scale. Load-test the deployed plans before making a
concurrency or uptime commitment.
