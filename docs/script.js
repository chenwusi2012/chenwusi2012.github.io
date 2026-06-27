const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const filterBar = document.querySelector(".filter-bar");
const galleryGrid = document.querySelector(".gallery-grid");
const galleryMessage = document.querySelector(".gallery-message");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
let activeCard = null;
let currentFilter = "all";

document.getElementById("year").textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const updateVisibleCards = () => {
  galleryGrid.querySelectorAll(".photo-card").forEach((card) => {
    const isMatch = currentFilter === "all" || card.dataset.location === currentFilter;
    card.style.display = isMatch ? "block" : "none";
  });
};

const addLocationFilters = (photos) => {
  const locations = [...new Set(photos.map((photo) => photo.location).filter(Boolean))].sort();

  locations.forEach((location) => {
    const button = document.createElement("button");
    button.className = "filter";
    button.type = "button";
    button.dataset.filter = slugify(location);
    button.textContent = location;
    filterBar.append(button);
  });
};

filterBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  currentFilter = button.dataset.filter;

  filterBar.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
  button.classList.add("active");
  updateVisibleCards();
});

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  activeCard?.focus();
};

const openLightbox = (card) => {
  const image = card.querySelector("img");
  const location = card.querySelector("figcaption span").textContent;
  const title = card.querySelector("figcaption strong").textContent;

  activeCard = card;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${location} — ${title}`;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  requestAnimationFrame(() => lightbox.classList.add("open"));
  lightboxClose.focus();
};

const createPhotoCard = (photo) => {
  const card = document.createElement("figure");
  const image = document.createElement("img");
  const caption = document.createElement("figcaption");
  const location = document.createElement("span");
  const title = document.createElement("strong");

  card.className = "photo-card";
  card.dataset.location = slugify(photo.location);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${photo.title} larger`);

  image.src = `assets/photos/${photo.file}`;
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";

  location.textContent = photo.location;
  title.textContent = photo.title;
  caption.append(location, title);
  card.append(image, caption);

  card.addEventListener("click", () => openLightbox(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(card);
    }
  });

  return card;
};

const loadGallery = async () => {
  try {
    const response = await fetch("assets/photos/photos.json");
    if (!response.ok) throw new Error(`Unable to load photo metadata: ${response.status}`);

    const photos = await response.json();
    addLocationFilters(photos);
    galleryGrid.append(...photos.map(createPhotoCard));
    updateVisibleCards();
  } catch (error) {
    galleryMessage.hidden = false;
    galleryMessage.textContent = "Photo gallery could not be loaded. If you are previewing locally, open the site with a local server instead of double-clicking index.html.";
    console.error(error);
  }
};

loadGallery();

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
