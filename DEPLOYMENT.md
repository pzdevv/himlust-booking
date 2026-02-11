# Deploying Himalayan Lust to Vercel

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- Your project pushed to a **GitHub**, **GitLab**, or **Bitbucket** repository
- Your Supabase project credentials (`URL` and `Anon Key`)

---

## Step 1 — Push to Git

Make sure your code is committed and pushed:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2 — Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your repository
3. Vercel auto-detects **Next.js** — no changes needed

## Step 3 — Set Environment Variables

In the Vercel project settings → **Environment Variables**, add:

| Variable                          | Value                                 |
| --------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | `https://your-project.supabase.co`    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Your Supabase anon/public key         |

> These are the same values from your local `.env.local` file.

## Step 4 — Deploy

Click **Deploy**. Vercel will:
1. Install dependencies (`npm install`)
2. Build the project (`npm run build`)
3. Deploy to a `.vercel.app` URL

## Step 5 — Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your custom domain (e.g., `trips.himalayanlust.com`)
3. Update your DNS records as instructed by Vercel

---

## Redeployment

Every push to `main` will automatically trigger a new deployment. You can also trigger manual redeployments from the Vercel dashboard.

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails with env errors | Ensure all env vars are set in Vercel dashboard |
| Images not loading | Verify `next.config.ts` has the Supabase hostname in `remotePatterns` |
| API/Database errors | Check Supabase RLS policies and that the anon key is correct |
| CSP blocking requests | The middleware CSP is configured for `xdxjrltgwbsdvdsrykrz.supabase.co` — update if your Supabase project ID changes |
