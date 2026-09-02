# Ratio

A private register of your own judgments. Upload Word files, read them into
records — summary, catchwords, issues, key holdings, bench, disposition — then
search, compare and ask questions across them.

Judgments never leave your device. They are extracted in the browser and stored
in the browser's own database (IndexedDB). Text is sent to a server only at the
moment you ask for an analysis, and only to your own Cloudflare function.

---

## Deploying from GitHub to Cloudflare Pages

### 1. Put this folder in a GitHub repository

On github.com: **New repository** → name it `ratio` → **Private** → Create.

Then either drag this whole folder onto the "uploading an existing file" link on
the empty repo page, or from a computer:

```bash
git init
git add .
git commit -m "Ratio"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/ratio.git
git push -u origin main
```

Do not commit `node_modules` or `dist` — `.gitignore` already excludes them.

### 2. Connect it to Cloudflare Pages

1. Go to **dash.cloudflare.com** → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
2. Authorise GitHub and pick the `ratio` repository.
3. Build settings:

   | Field | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Save and Deploy.** The first build takes about a minute.

### 3. Add your Anthropic API key

The analysis needs a key, and the key must stay on the server.

1. Get one at **console.anthropic.com** → API Keys.
2. In your Pages project: **Settings** → **Variables and Secrets** →
   **Add** → type **Secret**:

   - Name: `ANTHROPIC_API_KEY`
   - Value: your key (starts with `sk-ant-`)

3. **Save**, then **Deployments** → **Retry deployment** so the new secret is
   picked up.

The file `functions/api/messages.js` is a Cloudflare Pages Function. It receives
the request from the app, attaches the key, and forwards it. The key is never
sent to the browser.

### 4. Lock the site to yourself

The site is on the public internet. Your judgments are not — they sit in your
browser — but anyone who finds the URL could use your API key through it.

**The clean fix (recommended):** Cloudflare **Zero Trust** → **Access** →
**Applications** → **Add an application** → **Self-hosted**, pointed at your
Pages domain, with a policy allowing only your own email. Cloudflare then asks
for a one-time code before the site loads. No code changes.

**The quick fix:** add a second secret named `APP_TOKEN` with any long random
string, and a plain variable `VITE_APP_TOKEN` with the same string. The function
then rejects any request that does not carry it. This protects the API route
only, not the page itself.

---

## Running it on your own machine

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. The `/api/messages` route does not exist in
plain `vite dev`; to test it locally use:

```bash
npx wrangler pages dev -- npm run dev
```

with `ANTHROPIC_API_KEY` set in a `.env` file.

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
index.html                 page shell
src/main.jsx               entry point, installs storage
src/Ratio.jsx              the whole application
src/storage.js             IndexedDB adapter
functions/api/messages.js  Cloudflare function holding the API key
```
