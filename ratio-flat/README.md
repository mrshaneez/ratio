# Ratio

A private register of your own judgments. Every file sits at the top level of
the repository — there are no folders to create.

## Files

| File | What it is |
| --- | --- |
| `wrangler.jsonc` | Worker config: entry point and where the built site lives |
| `worker.js` | Serves the site and proxies `/api/messages` with your API key |
| `index.html` | Page shell |
| `main.jsx` | Entry point; installs browser storage |
| `Ratio.jsx` | The whole application |
| `storage.js` | IndexedDB adapter |
| `vite.config.js` | Build config |
| `package.json` | Dependencies and scripts |
| `.gitignore` | Keeps `node_modules` and `dist` out of git |

## Deploying

1. Put all nine files in the root of `mrshaneez/ratio`.
2. Cloudflare → your Worker → **Settings** → **Build**:

   | Field | Value |
   | --- | --- |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` |

3. **Save**, then **Deployments** → **Retry deployment**.

The build command is not optional. Cloudflare installs dependencies on its own
but will not build the site, and `wrangler deploy` needs the `dist` folder that
the build produces.

## Add your Anthropic API key

Without it the app still extracts and indexes judgments locally. With it, the
written summaries, the reasoned holdings, Ask and the consistency comparison
start working.

Worker → **Settings** → **Variables and Secrets** → **Add** → type **Secret**:

- Name: `ANTHROPIC_API_KEY`
- Value: your key from console.anthropic.com

Deploy again afterwards. The key stays on Cloudflare and never reaches the
browser.

## Lock the site to yourself

The site is public once deployed. Your judgments are not — they stay in your
browser — but anyone who finds the URL could spend your API key.

Cloudflare **Zero Trust** → **Access** → **Applications** → **Add an
application** → **Self-hosted**, pointed at your Worker's domain, with a policy
allowing only your email. No code changes.

## Running it locally

```bash
npm install
npm run dev          # the app, without the API route
npm run build && npx wrangler dev   # the app and the API route together
```

Put `ANTHROPIC_API_KEY` in a `.dev.vars` file for the second one.

## Backups

**Export** in the footer writes one JSON file with every judgment and its full
text; **Import** restores it. Browser storage can be cleared by the browser, so
export from time to time.
