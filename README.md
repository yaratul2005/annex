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
- **Interactive Features:** Responsive mobile navigation, FAQ accordion, scope planner, fluid first-paint animation, privacy consent choices, and a booking form with server-side email delivery.
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
├── vercel.json              # Retained for the previous Vercel deployment
├── _headers                 # Cloudflare Pages security headers
├── robots.txt               # Crawler directives optimized for Google, Bing, and AI engines (AEO)
├── sitemap.xml              # Structured XML sitemap with image metadata
├── package.json             # Cloudflare Pages build and local preview scripts
├── scripts/build-pages.mjs  # Prepares the static Cloudflare Pages site in dist/
├── api/contact.mjs          # Vercel booking-request endpoint
├── functions/api/contact.js # Cloudflare Pages booking-request endpoint
├── lib/contact-handler.mjs  # Shared booking validation and mailer dispatch
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

## Booking Email Delivery

The booking form submits to `/api/contact` on Vercel or `/api/contact` through the Cloudflare Pages Function. Vercel sends through Zoho Mail SMTP; the optional Cloudflare Pages deployment retains Resend over HTTPS. Both deliver inquiries to `support@annexbd.tech` and use the submitted visitor email as `Reply-To`.

### Vercel / Zoho Mail

- `SMTP_PASS`: Zoho mailbox password or app-specific password, stored as a Vercel encrypted environment variable.
- `SMTP_HOST`: optional; defaults to `smtppro.zoho.com` for a domain-based Zoho Mail organization account. Confirm the exact host in Zoho Mail's Server Configuration Details for the account's data center.
- `SMTP_PORT`: optional; defaults to `465` with SSL. Port `587` is supported for TLS; when using it, set `SMTP_HOST` to the host Zoho lists for the account.

If Zoho Mail has two-factor authentication enabled, `SMTP_PASS` may need to be an app-specific password. The sender address is kept aligned with the authenticated mailbox to avoid Zoho relay rejection. Vercel's Node.js function awaits SMTP delivery before returning its response.

### Optional Cloudflare Pages deployment / Resend

- `RESEND_API_KEY`: a Resend API key with permission to send email.
- `RESEND_FROM_EMAIL`: a sender address/domain verified in the Resend account, for example `ANNEX website <inquiries@your-verified-domain>`.

Never put these values in browser JavaScript or commit them to this repository. If delivery credentials are missing, the endpoint returns a setup status and the form displays a prefilled email-app fallback. The form validates fields, limits input length, rejects cross-origin JSON requests, and uses a honeypot; production anti-abuse limits should also be configured at the host/provider layer.

---

## Contact & Official Channels
- **Primary domain:** `https://www.annexbd.tech` (apex redirects here)
- **Official Support Email:** `support@annexbd.tech`
- **Location:** Dhaka-1215, Bangladesh
- **GitHub:** `https://github.com/yaratul2005/annex`
