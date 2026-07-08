# EduPath India Static Website

Production-ready static website for EduPath India, designed for Cloudflare Pages Direct Upload. No Node.js, npm install, server, database, or build command is required.

## Folder structure

Upload the contents of this `EduPath-India` folder. `index.html` must remain at the deployment root.

## Logo replacement

Replace `assets/images/logo.png` with your actual EduPath India logo. Keep the same filename for automatic replacement across the website.

## Contact details

Phone links use `tel:+919019492121`. Email links use `mailto:admission@edupathindia.com`. WhatsApp links use `https://wa.me/919019492121`. Instagram links use `https://www.instagram.com/edupath_india`.

To change these, update the HTML files and footer/header contact links.

## Editing homepage

Edit `index.html` for homepage sections. Shared styling is in `assets/css/styles.css` and responsive rules are in `assets/css/responsive.css`.

## Testimonials

Testimonials are in `data/testimonials.json`. Replace all placeholder testimonials with genuine, verified student feedback before publishing. Update `studentName`, `course`, `city`, `testimonial`, `rating`, `image`, and `featured`. Replace student placeholder images in `assets/images/` or add new files and update the JSON path.

## News

News cards are maintained in `data/news.json`.

To add a news item:
1. Add a new object in `data/news.json`.
2. Create a matching HTML article in `news/`.
3. Add a unique title, meta description, canonical URL, Open Graph tags, Twitter tags, and NewsArticle JSON-LD.
4. Add the URL to `sitemap.xml`.
5. Avoid inventing official admission dates, rankings, fees, eligibility, approvals, or outcomes.

## Adding a page

Create a new `.html` file at the root, copy the header/footer pattern from an existing page, add unique metadata, add a canonical URL, add internal links, and update `sitemap.xml`.

## Metadata and sitemap

Every page includes title, description, canonical, robots, Open Graph, Twitter card, theme color, author, language, viewport, format detection, and referrer policy. Keep each page unique when editing.

## Local preview

Open `index.html` directly in a browser. For the closest Cloudflare-like preview, run a simple local static server from this folder and visit `http://localhost:8000`.

## Cloudflare Pages deployment

Use Direct Upload. No build command is needed. Upload the contents of this folder, not a parent folder.

## Custom domain

After deployment, add `www.edupathindia.com` in Cloudflare Pages custom domains. Verify HTTPS and test both `www` and non-`www` behavior according to the domain settings you choose.

## Future form integration

`contact.html` contains a static enquiry form. It validates client-side and opens WhatsApp because no backend endpoint exists. When a form service or backend is ready, add the form `action` and `method`, then update the CSP in `_headers` if needed.