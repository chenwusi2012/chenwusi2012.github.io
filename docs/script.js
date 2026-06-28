const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const yearFilterBar = document.querySelector("#year-filters");
const locationFilterBar = document.querySelector("#location-filters");
const galleryCount = document.querySelector(".gallery-count");
const galleryGrid = document.querySelector(".gallery-grid");
const galleryMessage = document.querySelector(".gallery-message");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxCounter = document.querySelector(".lightbox-counter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let activeCard = null;
let photos = [];
let currentYear = "all";
let currentLocation = "all";

document.getElementById("year").textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getLocationsForCurrentYear = () => {
  const matchingPhotos =
    currentYear === "all"
      ? photos
      : photos.filter((photo) => String(photo.year) === currentYear);

  return [...new Set(matchingPhotos.map((photo) => photo.location).filter(Boolean))].sort();
};

const setActiveFilter = (filterBar, selectedValue) => {
  filterBar.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === selectedValue);
  });
};

const createFilterButton = (label, value) => {
  const button = document.createElement("button");
  button.className = "filter";
  button.type = "button";
  button.dataset.filter = value;
  button.textContent = label;
  return button;
};

const renderYearFilters = () => {
  const years = [...new Set(photos.map((photo) => photo.year).filter(Boolean))]
    .map(String)
    .sort((a, b) => Number(b) - Number(a));

  yearFilterBar.replaceChildren(createFilterButton("All", "all"));
  yearFilterBar.append(...years.map((year) => createFilterButton(year, year)));
  setActiveFilter(yearFilterBar, currentYear);
};

const renderLocationFilters = () => {
  const locations = getLocationsForCurrentYear();
  const locationValues = locations.map(slugify);

  if (currentLocation !== "all" && !locationValues.includes(currentLocation)) {
    currentLocation = "all";
  }

  locationFilterBar.replaceChildren(createFilterButton("All", "all"));
  locationFilterBar.append(
    ...locations.map((location) => createFilterButton(location, slugify(location))),
  );
  setActiveFilter(locationFilterBar, currentLocation);
};

const updateVisibleCards = () => {
  let visibleCount = 0;

  galleryGrid.querySelectorAll(".photo-card").forEach((card) => {
    const yearMatches = currentYear === "all" || card.dataset.year === currentYear;
    const locationMatches =
      currentLocation === "all" || card.dataset.location === currentLocation;
    const isVisible = yearMatches && locationMatches;

    card.style.display = isVisible ? "block" : "none";
    if (isVisible) visibleCount += 1;
  });

  galleryCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "photo" : "photos"}`;
};

yearFilterBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  currentYear = button.dataset.filter;
  setActiveFilter(yearFilterBar, currentYear);
  renderLocationFilters();
  updateVisibleCards();
});

locationFilterBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  currentLocation = button.dataset.filter;
  setActiveFilter(locationFilterBar, currentLocation);
  updateVisibleCards();
});

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  activeCard?.focus();
};

const getVisibleCards = () =>
  [...galleryGrid.querySelectorAll(".photo-card")].filter(
    (card) => card.style.display !== "none",
  );

const showLightboxCard = (card) => {
  const image = card.querySelector("img");
  const meta = card.querySelector("figcaption span").textContent;
  const title = card.querySelector("figcaption strong").textContent;
  const visibleCards = getVisibleCards();
  const currentIndex = visibleCards.indexOf(card);
  const hasMultiplePhotos = visibleCards.length > 1;

  activeCard = card;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${meta} — ${title}`;
  lightboxCounter.textContent =
    currentIndex >= 0 ? `${currentIndex + 1}/${visibleCards.length}` : "";
  lightboxPrev.hidden = !hasMultiplePhotos || currentIndex <= 0;
  lightboxNext.hidden = !hasMultiplePhotos || currentIndex >= visibleCards.length - 1;
};

const openLightbox = (card) => {
  showLightboxCard(card);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  requestAnimationFrame(() => lightbox.classList.add("open"));
  lightboxClose.focus();
};

const moveLightbox = (direction) => {
  const visibleCards = getVisibleCards();
  if (!activeCard || visibleCards.length < 2) return;

  const currentIndex = visibleCards.indexOf(activeCard);
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= visibleCards.length) return;

  showLightboxCard(visibleCards[nextIndex]);
};

const createPhotoCard = (photo) => {
  const card = document.createElement("figure");
  const image = document.createElement("img");
  const caption = document.createElement("figcaption");
  const meta = document.createElement("span");
  const title = document.createElement("strong");

  card.className = "photo-card";
  card.dataset.location = slugify(photo.location);
  card.dataset.year = String(photo.year);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${photo.title} larger`);

  image.src = `assets/photos/${photo.file}`;
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";

  meta.textContent = `${photo.location} · ${photo.year}`;
  title.textContent = photo.title;
  caption.append(meta, title);
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

    photos = await response.json();
    galleryGrid.append(...photos.map(createPhotoCard));
    renderYearFilters();
    renderLocationFilters();
    updateVisibleCards();
  } catch (error) {
    galleryMessage.hidden = false;
    galleryMessage.textContent =
      "Photo gallery could not be loaded. If you are previewing locally, open the site with a local server instead of double-clicking index.html.";
    console.error(error);
  }
};

loadGallery();

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => moveLightbox(-1));
lightboxNext.addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
