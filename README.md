# Ratio

A private register of your own judgments. Upload Word files, read them into
records — summary, catchwords, issues, key holdings, bench, disposition — then
search, compare and ask questions across them.

Judgments never leave your device. They are extracted in the browser and stored
in the browser's own database (IndexedDB). Text is sent to a server only at the
moment you ask for an analysis, and only to your own Cloudflare function.

---

## Deploying from GitHub to Cloudflare

This repo deploys as a **Worker with static assets**: `vite` builds the site
into `dist`, and `worker/index.js` serves it and answers `/api/messages`.

### If your Cloudflare project already exists

Your build failed with *"Could not detect a directory containing static files"*
because **Build command** was set to **None**, so `dist` was never built, and
there was no `wrangler.jsonc` to point at it. Both are fixed here. Push this
repo, then in the Cloudflare dashboard open your Worker →
**Settings** → **Build**:

| Field | Set it to |
| --- | --- |
| Build command | `npm install && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Save, then **Deployments** → **Retry deployment**.

### Starting fresh

1. Push this folder to a **private** GitHub repository.
2. **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Import a
   repository** → choose the repo.
3. Use the build and deploy commands in the table above.

### Add your Anthropic API key

Without it, the app still extracts and indexes judgments locally, but the
written summaries, Ask and the consistency comparison stay switched off.

1. Get a key at **console.anthropic.com** → API Keys.
2. Worker → **Settings** → **Variables and Secrets** → **Add** → type
   **Secret**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key (starts with `sk-ant-`)
3. **Deploy** again so the secret is picked up.

The key stays on Cloudflare. It is never sent to the browser and never appears
in the built bundle.

### Lock the site to yourself

The site is on the public internet. Your judgments are not — they stay in your
browser — but anyone who finds the URL could spend your API key through it.

**Recommended:** Cloudflare **Zero Trust** → **Access** → **Applications** →
**Add an application** → **Self-hosted**, pointed at your Worker's domain, with
a policy allowing only your own email. Cloudflare then asks for a one-time code
before the site loads. No code changes.

**Quicker:** add a Secret `APP_TOKEN` with a long random string, and a plain
variable `VITE_APP_TOKEN` with the same string. The Worker then rejects any API
request without it. This protects the API route only, not the page.

### Deploying from your own machine instead

```bash
npm install
npx wrangler login
npm run deploy
```

---

## Running it on your own machine

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. The `/api/messages` route does not exist in plain `vite dev`. To run the Worker
and the site together:

```bash
npm run build
npx wrangler dev
```

with `ANTHROPIC_API_KEY` in a `.dev.vars` file.

---

## What works without the API

Everything except the written summaries and the reasoned holdings:

- **Extraction** — `.docx` is unzipped and read in the browser, including
  footnotes and endnotes. `.doc`, `.rtf`, `.txt` and `.md` are also handled.
- **The Dhivehi reader** — case number, court, subject, parties, judgment date,
  disposition, the catchwords line, the introduction as a headnote, the grounds
  of appeal, the outline of sections, the bench, and the key holdings found by
  their decision markers (ކަނޑައަޅ، ދެކެމެވެ، ކަނޑައެޅިދާނެ).
- **Search**, including inside full texts, in Thaana or Latin.
- **Patterns** — dispositions, subjects, years, authorities, panels.

The API adds the reasoned holding against each issue, the Ask view, the
consistency comparison, and the written read-back on Patterns.

## Backups

**Export** in the footer writes a single JSON file containing every judgment and
its full text. **Import** restores it. Browser storage can be cleared by the
browser, so export from time to time.

## Files

```
wrangler.jsonc             Worker config: entry point and asset directory
worker/index.js            serves the site, holds the API key, proxies /api/messages
index.html                 page shell
src/main.jsx               entry point, installs storage
src/Ratio.jsx              the whole application
src/storage.js             IndexedDB adapter
functions/api/messages.js  the same proxy as a Pages Function, if you ever switch to Pages
```
