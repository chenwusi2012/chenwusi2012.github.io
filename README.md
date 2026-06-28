# Photography Portfolio Website

This is a simple static photography portfolio website that can be hosted on GitHub Pages.

## Files

- `docs/index.html` — website content
- `docs/style.css` — visual design
- `docs/script.js` — mobile menu, gallery rendering, and gallery filters
- `docs/assets/photos/` — optimized WebP photos
- `docs/assets/photos/photos.json` — photo titles, years, locations, filenames, and alt text
- `original-photos/` — local original photos; Git ignores this folder

## How to customize

1. Put original photos in `original-photos`.
2. Convert them to WebP with `convert-photos.cmd`, or ask Codex to do it.
3. Add each displayed photo to `docs/assets/photos/photos.json`.

Example:

```json
{
  "file": "DSC02413.webp",
  "title": "Island Sunset",
  "location": "Honolulu",
  "year": 2021,
  "alt": "Palm trees silhouetted against a colorful island sunset"
}
```

4. Change the name, bio, and contact email inside `docs/index.html`.

Because the gallery loads `photos.json`, GitHub Pages will display it normally. For local preview, use a small local server instead of double-clicking `docs/index.html`; some browsers block JSON loading from `file://` pages.

## Recommended photo size

For web portfolio use:

- Long edge: 1600–2400 px
- Format: WebP
- Target file size: about 300 KB to 1.5 MB per photo

Avoid uploading original full-resolution camera files because the site will load slowly.

## Photo workflow

1. Copy original photos into the local `original-photos` folder. Git ignores this folder, so its contents are not uploaded to GitHub.
2. Double-click `convert-photos.cmd`, or ask Codex to convert the new photos.
3. Optimized WebP files are written to `docs/assets/photos` with a maximum edge of 2000 px and quality 84.
4. Add the new WebP filenames, year, location, and metadata to `docs/assets/photos/photos.json` when placing them in the gallery.

The converter skips photos that already have an up-to-date WebP file. Run `convert-photos.cmd --force` to rebuild all outputs.

## GitHub Pages publishing

For a personal website:

1. Create a GitHub repository named: `your-github-username.github.io`
2. Keep the website files inside the repository's `docs` folder.
3. Go to repository Settings → Pages.
4. Choose source: `Deploy from a branch`.
5. Choose branch: `main`, folder: `/docs`.
6. Visit: `https://your-github-username.github.io`

For a project website:

1. Upload these files to any repository.
2. Enable GitHub Pages in Settings → Pages.
3. Your URL will usually be:
   `https://your-github-username.github.io/repository-name/`
