# Global Endtime Harvest: Website

Static website (HTML, CSS and JavaScript, no build step) for **Global Endtime Harvest (GEH)**.
It is built for **GitHub Pages** with a custom domain.

## Structure

```
website/                         ← this folder is the repository root
├── index.html                   Home
├── about.html                   About (incl. #mission-vision)
├── our-mandate.html
├── lead-evangelist.html
├── our-team.html
├── crusades.html                (#upcoming, #past)
├── ilaro-jesus-crusade-2026.html
├── our-work.html
├── humanitarian-outreach.html   (#medical)
├── media.html
├── partner.html                 Paystack giving (partner.html#monthly / #one-time)
├── give.html
├── pray.html
├── invite.html
├── contact.html
├── 404.html                     GitHub Pages "not found" page
├── assets/
│   ├── css/style.css            All styles (tablet ≤ 1024px, mobile ≤ 767px)
│   ├── js/main.js               Menu, animations, copy buttons, video, forms, giving tabs
│   └── img/                     Photos (1600px + 800px versions), team portraits, icons
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── .nojekyll                    Tells GitHub Pages to serve files as they are
```

Every page is a complete HTML file. The **header, menu and footer are repeated in each page**.
To change them (for example, a phone number), use *Find & Replace in Files* across all `.html` files.

## Quick edits

### Ilaro recap video (YouTube)
The recap is the YouTube Short `https://www.youtube.com/shorts/3LgG6f70f_g`, set at the top of `assets/js/main.js`:

```js
recapVideoId: '3LgG6f70f_g',
```

It plays on **Ilaro Jesus Crusade 2026** and **Media**. To use a different video, paste its ID here
(from `youtube.com/watch?v=ID` or `youtube.com/shorts/ID`). An empty value shows "Video coming soon".
The players are portrait (9:16) because the recap is a Short. For a normal wide video, remove the
`is-short` class from the `<div class="video is-short …" data-yt="recap">` element on both pages.
The video loads only when clicked, from YouTube's privacy-enhanced domain (`youtube-nocookie.com`).

### Social media links
| Platform | Link |
|---|---|
| YouTube | `https://www.youtube.com/@GlobalEndtimeHarvest` |
| Instagram | `https://www.instagram.com/globalendtimeharvest/` |
| Facebook | **Pending.** It currently opens Facebook search results for "Precious Ologunloluwa". Replace `https://www.facebook.com/search/top?q=Precious%20Ologunloluwa` in all `.html` files with the profile URL. |

### Team photos
Portraits are 4:5, **800 × 1000 px** JPG, in `assets/img/` (e.g. `team-john-adekanmbi.jpg`).
In `our-team.html`, replace the initials tile of the member, for example

```html
<div class="photo"><div class="ph" aria-hidden="true">JA</div></div>
```

with

```html
<div class="photo"><img src="assets/img/team-john-adekanmbi.jpg" width="800" height="1000" alt="John Adekanmbi" loading="lazy"></div>
```

All 8 team members have photos. Crop new portraits chest-up with the face in the upper third so the cards stay consistent.

### Forms (Invite GEH, Contact)
GitHub Pages has no server, so the forms check the required fields and then open a ready-written message:
**Send via WhatsApp** (to +234 903 744 4800) or **Send via Email** (to globalendtimeharvestmission@gmail.com).
Both are set in `assets/js/main.js` → `SETTINGS`. Nothing is sent to a third party.

### Giving
Paystack pages (one-time, plus monthly ₦2,000 / ₦5,000 / ₦10,000 / ₦20,000 / ₦50,000 / ₦100,000 / Custom) are linked in `partner.html`.
Bank details and the PayPal email (with copy buttons) are in `partner.html` and `give.html`.

## Publish on GitHub Pages

1. Create a GitHub repository (e.g. `geh-website`) and upload **the contents of this folder** to its root
   (GitHub web: *Add file → Upload files*, or `git push`).
2. **Settings → Pages** → *Build and deployment* → Source **Deploy from a branch** → Branch **main** / **(root)** → Save.
3. The site goes live at `https://<username>.github.io/geh-website/` within a minute or two. All links are relative, so it works there too.

## Attach the custom domain

1. **Settings → Pages → Custom domain**: enter the domain (e.g. `www.yourdomain.org`) → Save.
   GitHub adds a `CNAME` file to the repository automatically. Keep it.
2. At the domain registrar, set the DNS records:

   | Type | Host | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `<username>.github.io` |

3. When the DNS check passes, tick **Enforce HTTPS**. The certificate can take up to 24 hours.
4. Recommended: verify the domain under *GitHub → Settings (your account) → Pages → Add a domain*, so no other account can claim it.
5. Replace the placeholder `https://YOUR-DOMAIN` with the real address (no trailing slash) in all `.html` files, `sitemap.xml` and `robots.txt`.
   This sets the canonical links, the social-sharing preview (`og:image`) and the sitemap.
6. Submit `https://yourdomain.org/sitemap.xml` in Google Search Console.

## Built in

- Responsive at every width from 360px phones to large desktops, with a sticky header, an off-canvas mobile menu and a mobile action bar.
- Accessible: skip link, keyboard-operable menu, lightbox and video, visible focus states, reduced-motion support.
  Content stays visible even if JavaScript or animations are unavailable.
- Fast: responsive images (`srcset`), lazy loading, videos loaded on click, no frameworks.
- Search and sharing: unique title and description per page, Open Graph and Twitter cards, Organization schema, sitemap and robots.txt.
