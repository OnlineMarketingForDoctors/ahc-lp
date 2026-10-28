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

## Structure

Static HTML, CSS and JS, no build step. Pages live in their own folders (`/hair-transplant-greece/index.html`)
and share `/assets` by absolute path.

- Pages: `/hair-transplant-greece/` (travel page: sells Greece and the clinic, Advanced Team first, Vekris Signature
  as the optional upgrade) and `/vip-hair-transplant/` (Vekris Signature only: private access to Dr Vekris for
  high-profile, discreet, complex, revision and specialised cases, as a destination treatment). They share `assets/js/greece.js`; the VIP page adds `assets/css/vip.css`
  and `body.vip`, which the script checks for what differs (for example the Why tabs).
- `/de/haartransplantation-griechenland/` is the German copy of the travel page (`<html lang="de">`). The shared
  script switches its own copy to German when `lang="de"`, so keep both versions of any new script text in step.
- `/` is a plain list of the landing pages (no redirect); add new landing pages to it.
- `#cost` on the travel page is used as a Google Ads sitelink: keep that id.
- Pricing (Advanced Team): one surgical day from €3,000, two surgical days €6,000. Never state a graft count:
  grafts are set by the individual medical assessment. The Greece vs Turkey and UK comparisons are qualitative
  and await the clinic's approval.
- The enquiry form on both pages is a LeadConnector (GoHighLevel) iframe; `form_embed.js` sizes it to the form.
- `/thank-you/` is the page to send form submissions to (`?from=greece` or `?from=vip` tailors the
  copy and links). Its styles are in `assets/css/thanks.css`.
- `/danke/` is the German thank-you page, for the German travel page's form. Its links go to the German page.
- `assets/css/base.css` is the homepage stylesheet from the `advanced-hair-clinics` repo, trimmed to the
  sections reused here. Page-specific styles go in their own file (`assets/css/greece.css`).
- Images are WebP. Generated images for this site are in `assets/img/greece/`, with an `-sm` version for mobile.
- Copy is British English with no em dashes.
