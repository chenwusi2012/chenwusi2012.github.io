# Photography Portfolio Website

This is a simple static photography portfolio website that can be hosted on GitHub Pages.

## Files

- `docs/index.html` — website content
- `docs/style.css` — visual design
- `docs/script.js` — mobile menu and gallery filters
- `docs/assets/photos/` — sample placeholder images

## How to customize

1. Replace the SVG sample images in `assets/photos/` with your own photos.
2. Keep the same filenames if you want the site to work without editing HTML.
3. Or edit `index.html` and change image paths such as:

```html
<img src="assets/photos/photo-01.jpg" alt="Landscape photo">
```

4. Change the name, bio, categories, and contact email inside `index.html`.

## Recommended photo size

For web portfolio use:

- Long edge: 1600–2400 px
- Format: JPG or WebP
- Target file size: about 300 KB to 1.5 MB per photo

Avoid uploading original full-resolution camera files because the site will load slowly.

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
