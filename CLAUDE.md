# ahc-lp

## This site must never be indexed by search engines

Noindex is enforced in three places. Keep all three in place unless the owner explicitly says the site is going live.

1. **HTTP header** – `vercel.json` (Vercel) and `_headers` (Netlify / Cloudflare Pages) send
   `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` on every path, including images and PDFs.
2. **Meta tag** – every HTML page must include, inside `<head>`:
   ```html
   <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
   ```
   If a framework is introduced, set this in the shared root layout so no page can miss it.
3. **No sitemap** – do not add a `sitemap.xml` or sitemap reference.

Do **not** add `Disallow: /` to `robots.txt`. Blocking crawling stops search engines from seeing the
noindex signals above, and blocked URLs can still appear in results if linked from elsewhere.
