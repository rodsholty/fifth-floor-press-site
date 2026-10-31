# Audit — Fifth Floor Press

**Date:** 31 October 2026
**Scope:** the site on branch `cursor/add-rever-01ad` (the source this redesign started from), checked against the live GitHub Pages site at `https://fifthfloorpressbooks.com`.
**Live vs this branch:** production matches that branch except it does not yet include *REVER*. This branch adds the book, the cover, and the “coming soon” Amazon state.

## How it was checked

- Every HTML page in the branch: `/`, `books.html`, `kessler.html`, `marek.html`, `dare.html`, `about.html`, `contact.html`, `/links/`.
- Every internal link, anchor, image, stylesheet, and script.
- Every unique Amazon URL (25 product pages, plus the *REVER* search fallback), requested and matched to the title and edition on the page.
- The live site, including extensionless URLs (`/about`, `/books`, …), `robots.txt`, `sitemap.xml`, and a missing path.
- Instagram’s public URL (the site’s only social link).
- CSS breakpoints, asset byte sizes, heading structure, and form behavior. Mobile layout was then confirmed in a browser at 390px and 1440px after the fixes below.

## Top findings

1. **The email form captured nothing.** On the homepage, both author pages that had it, and `/links`, the form was `mailto:info@fifthfloorpressbooks.com`. In an in-app TikTok or Instagram browser that usually does nothing, and no address was stored. There was no consent line and no privacy note.
2. **The site looked like a pleasant catalog, not a place.** Cream page, Georgia, a red rule, a centered wordmark. Solid and readable, and interchangeable with a lot of small-press templates. The mark on the door is already a Roman V — the fifth — and the site never used that.
3. **Most covers are 167 pixels wide.** Twelve of the fourteen JPEGs are about 8–20 KB and 167×268. The old shop stretched them toward ~270px on a desktop row, so they go soft. *REVER* is the exception (600×960). This is not a broken image. It needs new exports from the owner.
4. **`/links` was the page that mattered for traffic, and it was the least described page.** No canonical URL, no Open Graph or Twitter tags. The rest of the site pointed social previews at the favicon, not a share card.
5. **The homepage source had two `h1` elements** (the free-promo block and the “now on Amazon” block). Only one was hidden, and only after JavaScript.
6. **No privacy page, no unsubscribe page, no designed 404.** A missing URL returned GitHub’s default 404.

Nothing in the product graph was a dead link. The failure was the form, and the ceiling was the design.

## Link check

**Internal.** Every `href` and `src` on those eight pages resolved to a file in the repo. Every `#anchor` (book ids, series jumps, `#featured`, `#coming-soon`) matched an id. Checked again after the redesign, including `privacy.html`, `unsubscribe.html`, and `404.html`.

**Extensionless URLs.** On the live site, `/about`, `/books`, `/contact`, `/kessler`, `/marek`, `/dare`, and `/links` all return the same pages as the `.html` files. GitHub Pages does that when the file is `about.html`. New pages are `.html` files for the same reason, so `/privacy` and `/unsubscribe` will behave the same way once this is published. Do not rename those files to a folder without keeping the `.html` URL.

**Amazon.** All 25 `/dp/` links returned the right book and the right edition (Kindle vs paperback). Two paperbacks answered with a bot check on the first try and the correct product page on the retry (*Resignation* paperback `B0HMJRS5XF`, *Try the Spirits* paperback `B0HK21F5SR`). They are not broken.

| Book | Kindle | Paperback |
| --- | --- | --- |
| Triage | B0HBRN3KB9 | B0HKGKGJFR |
| Golden Hour | B0HJCZ1WHV | B0HKGMJCSF |
| Edema | B0HK3446QH | B0HKGKDRMG |
| Resignation | B0H3M3XQ45 | B0HMJRS5XF |
| Koshaku | B0HL5MXW6R | B0HKH1K821 |
| Candid | B0HKH33C78 | B0HKH51Z2S |
| Try the Spirits | B0HK1KGHK5 | B0HK21F5SR |
| Last Chair | B0HCK37SJG | B0HCK9F65M |
| The Scattering | B0HKGPR52R | B0HKH228V4 |
| The Long Winter | B0HNCPJHZY | B0HND1K8XD |
| Eli | B0HLTVTCT9 | B0HKHN41FN |
| Settled | B0HMH53WPR | B0HMH46HM7 |
| NATURAL | — (paperback only, on purpose) | B0HPSN7R8D |

*REVER* has no ASIN yet. The button goes to an Amazon search for `REVER R. J. Marek`, not a dead `/dp/` link. That search URL returns a normal results page.

**Other external.** `mailto:info@fifthfloorpressbooks.com` and `tel:+18309996525` are real contact links, not the signup. The owner confirmed Instagram `https://www.instagram.com/fifthfloorpress/` is this press. TikTok is `https://www.tiktok.com/@fifth.floor.press`, added in the footer and on `/links`. A different publisher uses `fifthfloorpress.com` (no “books”); that domain is not linked.

**Broken links fixed:** none. There were no 404s to repair. The signup `mailto` was replaced because it did not collect addresses, not because the address was wrong.

## Images

Every `img` src exists. Favicon set, apple touch icon, and header mark are in `brand/`. Covers are in `covers/`.

| File | Pixels | Notes |
| --- | --- | --- |
| Twelve catalog covers | 167×268 (Eli 168×252, NATURAL 167×267) | Sharp only near their native size |
| `last-chair.jpg` | 240×384 | |
| `rever.jpg` | 600×960 | The only print-scale cover |
| `header-mark.png` | 192×192 | Roman V in a square. This is the fifth. |

The redesign keeps shop covers near that native size (two columns on a phone, a dense shelf on a wide screen) instead of blowing them up. Higher-resolution exports would still be the real fix.

## Mobile

The old CSS did the important things: a viewport, 44px targets, stacked buy buttons under 640px, a two-column shop, and a `/links` page built for a phone. The cost was an eight-item uppercase nav that wrapped into several rows before any book, and no safe-area padding on the main pages.

`/links` is the bio-link page and was already the right shape: one column, a featured book, two buttons, then a grid. It did not mention the Koshaku free window, which is the offer in market this week.

## Performance

The old site was already light. No web fonts, no third-party scripts, HTML/CSS/JS in the tens of kilobytes, covers totaling roughly 200 KB, GitHub `Cache-Control: max-age=600`. The shop loaded every cover immediately.

What changed, and why it should stay fast:

- `/links` still ships no web font. System Georgia and a system sans. That page is what TikTok and Instagram open.
- The reading room uses subsetted Fraunces (roman ~67 KB, italic ~79 KB) and Outfit (~29 KB), `font-display: swap`, latin `unicode-range` only. They are not preloaded, so the cover stays the thing the browser fetches first.
- Shop and below-the-fold covers use `loading="lazy"`.
- Still no third-party script, analytics, or ad tag.

## SEO and metadata

Present on the main pages before this change: title, description, canonical, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card=summary`, `lang="en"`, `sitemap.xml`, `robots.txt`.

Gaps:

- `og:image` was the 512 favicon. Fine as a logo, weak as a share card.
- Twitter tags were only the card type.
- `/links` had no canonical and no social tags.
- No structured data.
- Two `h1`s in the homepage source.
- Sitemap had no privacy URL, because the page did not exist.

Addressed: one homepage `h1`, a 1200×630 share card (`brand/og-card.png`), full Twitter tags, canonical and social tags on `/links`, Organization JSON-LD on the homepage, `privacy.html` in the sitemap, `noindex` on the unsubscribe and 404 pages. `theme-color` is `#100e0c`.

## Accessibility

Already in good shape: skip link, `header` / `main` / `footer`, labeled navs, focus outlines, form labels, buy buttons with accessible names, decorative logo with an empty alt, width and height on images.

Gaps addressed: `aria-current="page"` on the active item, one `h1`, a live region for form success and error, the honeypot removed from the tab order and from the accessibility tree, visible text for errors (not color alone), `scroll-margin` so the sticky header does not cover anchors, and `forced-colors` / `prefers-reduced-motion` hooks.

The floor numerals I–IV and the lit V are `aria-hidden`. The same fact is in the text “Floor V · Unlisted”.

## Email capture

The old form’s own comment said it was a placeholder and that no address was stored. It asked for an email and a button labeled “Email the press”.

It is now a real form: email, optional first name, a required consent checkbox for the weekly note, a honeypot, and success / error / “opening soon” states. It `POST`s JSON with `fetch` to `SIGNUP_ENDPOINT` in `signup-config.js`. That constant is blank, so the form says signups are opening soon and does not pretend to save. The Apps Script that writes a Google Sheet is in `backend/apps-script/`, with deploy steps in `DEPLOY.md`. Unsubscribe is `unsubscribe.html` plus a `doGet` token handler.

## Promo window

`promo.js` shows the Koshaku “free on Kindle, November 1–5” state until the end of 5 November 2026, US Central (`2026-11-06T06:00:00Z`). There is no start date, so on 31 October the homepage already announces that window. That behavior was left as it was, so the announcement is not pulled down the day before the sale. `?promo=free` and `?promo=ended` still preview either state.

## What still needs the owner

- Deploy the Apps Script (`backend/apps-script/DEPLOY.md`) and paste the `/exec` URL into `SIGNUP_ENDPOINT` in `signup-config.js`. Until then the form honestly says signups are opening soon.
- Paste *REVER* Kindle and paperback ASINs into `REVER_KINDLE_ASIN` and `REVER_PAPER_ASIN` in `catalog.js` when KDP assigns them.
- A Kindle ASIN for *NATURAL*, if that edition is coming. The paperback link is live.
- Higher-resolution covers (around 800px wide) if the shelf should look sharp on large monitors.
- After 5 November 2026 the free-book banner turns itself off for anyone with JavaScript. The no-JavaScript homepage still shows the free wording, because that was the static default. Edit the homepage `h1` when the sale is over if that matters.

The owner confirmed Instagram `@fifthfloorpress` and supplied TikTok `@fifth.floor.press`. Both are linked from every footer and from `/links`.
