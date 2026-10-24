# ANNEX BD (www.annexbd.tech)
**Next-Generation IT, Web Architecture & Meta Performance Growth Suite**
*Operational Hub: Dhaka-1215, Bangladesh | Virtual Global Delivery*

GitHub Repository: [https://github.com/yaratul2005/annex](https://github.com/yaratul2005/annex)

---

## Visual system

- **Color System:**
  - **Alternating Section Rhythm:** Cool mineral surfaces (`#EAF0F1`) balance deep blue-green ink (`#10242D`) for a technical, calm reading cadence.
  - **Single Accent Color:** Signal teal (`#087985`) marks primary actions and key interactions; a brighter mint is reserved for dark surfaces.
- **Typography:**
  - **Headings:** Direct, geometric `Space Grotesk` typography gives the studio a clear engineering voice.
  - **Body Text:** Clean, legible sans-serif (`Inter`).
  - **Technical Details:** Monospace reserved for small labels and technical specs.
- **CTA Rule:** Keep the primary CTA label consistent: `"Book a free 20-minute call"`. Use the verified studio email for direct inquiries.
- **Content Integrity:** No invented clients, testimonials, or campaign results. Portfolio visuals are presented as concept directions. Zero emojis.
- **Brand Assets:** Transparent high-resolution logo formatted and trimmed for dark headers (`assets/logo-white-trimmed.png`) and standard web use (`assets/logo-trimmed.png`).
- **Interactive Features:** Responsive mobile navigation, FAQ accordion, scope planner, fluid first-paint animation, privacy consent choices, and a MongoDB-backed booking form protected by Google reCAPTCHA v3.
- **SEO + GEO + AEO Optimization:** Google Rich Snippets Schema JSON-LD, localized geographic meta tags for **Dhaka-1215, Bangladesh**, Answer Engine Optimization (AEO) for Perplexity, ChatGPT, Gemini, and Claude AI search indexing.
- **Cloudflare Pages Ready:** A static build packages only the site files, while Cloudflare Pages provides the CDN and deployment-aware asset caching.

---

## Project Structure

```
D:\ANNEX\
│
├── index.html               # Main production page with structured data and consent-gated optional services
├── about.html               # Studio and founder overview
├── terms.html               # Website and service terms
├── privacy.html             # Privacy and cookie notice with a visitor settings link
├── 404.html                 # Branded custom 404 error page
├── vercel.json              # Vercel redirects and security headers
├── _headers                 # Cloudflare Pages security headers
├── robots.txt               # Crawler directives optimized for Google, Bing, and AI engines (AEO)
├── sitemap.xml              # Structured XML sitemap with image metadata
├── package.json             # Cloudflare Pages build and local preview scripts
├── scripts/build-pages.mjs  # Prepares the static Cloudflare Pages site in dist/
├── api/contact.mjs          # Vercel booking-request endpoint
├── api/recaptcha-config.mjs # Public reCAPTCHA site-key endpoint
├── lib/contact-handler.mjs  # Booking validation, reCAPTCHA, and database dispatch
├── lib/contact-store.mjs    # MongoDB Atlas collection and expiry index
├── lib/recaptcha.mjs        # Server-side Google token verification
├── .gitignore               # Repository ignore rules
│
├── assets/
│   ├── favicon.svg          # Modern cyber geometric SVG monogram favicon
│   ├── fonts/                # Self-hosted Inter and Space Grotesk WOFF2 files + OFL licenses
│   ├── logo bg.png          # Original source logo
│   ├── logo.png             # Standard URL-safe logo
│   ├── logo-white.png       # Pure white inverted transparent logo
│   ├── logo-trimmed.png     # Trimmed transparent logo (tight padding)
│   ├── logo-white-trimmed.png # Optimized white navbar logo (811x151)
│   ├── og-image.png         # 1200x630 OpenGraph / Twitter social preview banner
│   ├── extra/
│       ├── laptop branding.png # Hero section background artwork
│       └── web.png             # Web architecture section background artwork
│   └── shapes/
│       ├── orbit-system.svg    # Hero orbital ornament
│       ├── blueprint-grid.svg  # Architecture linework
│       └── signal-path.svg     # Process section signal motif
│
├── css/
│   └── styles.css           # Mineral blue-gray surfaces, deep blue-green sections, and signal-teal accents
│
└── js/
    └── main.js              # Navigation, FAQ, scope planner, and accessible booking modal
```

---

## Core Services Highlighted

1. **Website Development (Flagship)**
   - **E-Commerce Solutions:** Custom WooCommerce, Shopify, fast checkouts, local payment gateways (bKash Merchant, Nagad, Rocket, SSLCommerz) and global Stripe/PayPal.
   - **Educational & School Portals:** Student admission records, fee collection with automated receipts, staff dashboards, and attendance notices.
   - **Corporate & Enterprise Hubs:** High-authority institutional web presences with investor relations, compliance, and edge speed.
   - **Creator & Personal Portfolios:** Modern visual showcases, interactive project galleries, and direct meeting booking integrations.
2. **Meta Ads Growth Lab (High Demand)**
   - Conversions API (CAPI) server-side tracking (bypassing iOS 14+ ad-blockers).
   - High-converting B2B and B2C lead generation funnels.
   - Dynamic multi-tier retargeting and creative testing matrices.
3. **Canva Branding & Visual Kits**
   - Editable Canva Pro templates, vector brand guideline kits, corporate pitch decks, and social media ad suites.
4. **DevOps, DNS & Cloudflare Edge Hosting**
   - Zero-downtime server setups, automated Git CI/CD deployments, DNS management, and edge SSL security hardening.
5. **Managed Tech & IT Supports**
   - System diagnosis, API integrations, database optimization, and virtual technical helpdesk.
6. **After-Sales SLA & Hourly Retainers**
   - Transparent per-hour rate models, guaranteed emergency response times, and ongoing maintenance retainers.

---

## Cloudflare Pages Deployment Guide

The site is a static HTML project. Cloudflare Pages serves its assets from Cloudflare's CDN and revalidates browser copies between deploys. Do not put Cloudflare's proxy in front of the Vercel deployment; that creates a double-proxy setup and can add stale-cache and latency issues.

### Connect GitHub

1. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git** and select `yaratul2005/annex`.
2. Set the production branch to `main`, the build command to `npm run build:pages`, and the build output directory to `dist`.
3. Deploy once and confirm the generated `*.pages.dev` preview loads correctly.
4. In the Pages project, add `www.annexbd.tech` and `annexbd.tech` under **Custom domains**. Add them through the Pages custom-domain flow so Cloudflare creates the correct records.
5. In the Cloudflare zone, create a redirect rule for `http.host eq "annexbd.tech"` to send requests to `https://www.annexbd.tech` plus the original path, with query-string preservation enabled and status `301`.
6. After the Pages deployment and both custom domains are active, remove the old Vercel DNS targets and stop using the Vercel project for production traffic.

The repository's `vercel.json` remains only as a fallback for the previous host; Cloudflare Pages ignores it. The `_headers` file leaves cache lifetime management to Pages so its stable, unversioned asset names do not stay pinned in visitors' browsers for days or months.

---

## Local Development & Preview

To preview the website locally on your computer:
```bash
# Using Node.js npx serve
npm start

# Or test emoji compliance
npm run test:emoji
```
Local address: `http://localhost:3000`

## Privacy Consent & Analytics

- Google Analytics 4 (`G-WLNJ46L9RH`) and the Trustpilot widget are not requested until a visitor opts into their respective categories. Rejecting optional services leaves both off. The consent record is stored in local storage for up to 180 days and can be changed from the footer.
- Fonts are self-hosted, so Google Fonts does not receive a request before a visitor makes a choice.
- Audience measurement is the only analytics category; the site has no advertising pixel or ad-personalization integration. Google signals and ad-personalization signals are disabled in the GA4 config.
- The notice and consent UI apply the same opt-in default to all visitors rather than relying on imprecise IP-based region detection. This is a privacy-preserving implementation baseline, not a guarantee of legal compliance in every jurisdiction. Confirm the organization's data practices and applicable local requirements before relying on the notice.
- `www.annexbd.tech` is the canonical host. Cloudflare's zone redirect rule sends the apex domain to `www`; configure both names as custom domains on the Pages project.
- The provided `G-...` value is a GA4 measurement ID, not a Google Tag Manager container ID. A GTM container requires a separate `GTM-...` ID. If GTM is added later, avoid loading the same GA4 property through both GTM and the direct `gtag.js` snippet, which can duplicate page views.

## Booking Form Storage

The booking popup submits to `/api/contact` on Vercel and writes directly to MongoDB Atlas; this route does not send email. Visitors provide their name, a preferred contact method (email or phone with a country calling code), and a short message. New records are saved in the `annex.contact_requests` collection with a 30-day TTL expiry. The handler validates and bounds fields, rejects cross-origin JSON requests, ignores a honeypot field, and returns a retryable error if MongoDB is unavailable.

- `annex_MONGODB_URI`: MongoDB Atlas Marketplace integration variable shown in Vercel. `annex_MONGODB_URL` and `MONGODB_URI` are also supported as alternate names.
- `GLOBAL_CONFIG`: Vercel Global Config connection used for the boolean `contact_paused` switch.
- `SiteK`: public Google reCAPTCHA v3 site key; served to the browser by `/api/recaptcha-config`.
- `SecretK`: private Google reCAPTCHA v3 secret key; only the Vercel contact function reads it.
- `RECAPTCHA_MIN_SCORE`: optional score threshold from `0` to `1`; defaults to `0.5`.

Register the production hostname(s) in Google's reCAPTCHA settings and set `SiteK` and `SecretK` in the Vercel Production environment. The browser requests a token for `contact_submit` only at submit time; Vercel verifies its success, action, score, and exact request hostname with Google's verification endpoint before inserting into MongoDB. Tokens expire after two minutes and are single-use. Keep the reCAPTCHA badge visible; never expose the secret key in browser code or commit it.

### Vercel Global Config: temporary contact-form pause

The Vercel contact function reads one boolean setting from the connected Global Config store before saving an inquiry. Add the item `contact_paused` with value `false` to keep inquiries enabled; change it to `true` to temporarily pause form submissions, then set it back to `false` to resume. The change can take up to 10 seconds to propagate globally. If the setting is absent or a Global Config read fails, the handler continues normal database storage and logs only a sanitized error type. The connection string stays in Vercel's `GLOBAL_CONFIG` environment variable. Do not put leads, IP addresses, device identifiers, or other personal data in Global Config.

### MongoDB Atlas contact collection

Atlas records contain the selected contact fields, short message, source, and creation time. A 30-day TTL index schedules automatic deletion; Atlas TTL cleanup may run after the expiry time rather than at that exact moment. Keep the MongoDB URI in Vercel environment variables and never commit it.

### Other hosting targets

The MongoDB- and reCAPTCHA-backed `/api/contact` function is implemented for Vercel. The former Cloudflare Pages email function has been removed; deploy the contact API on Vercel or provide a host-compatible MongoDB and reCAPTCHA backend before enabling submissions on another platform.

---

## Contact & Official Channels
- **Primary domain:** `https://www.annexbd.tech` (apex redirects here)
- **Official Support Email:** `support@annexbd.tech`
- **Location:** Dhaka-1215, Bangladesh
- **GitHub:** `https://github.com/yaratul2005/annex`
