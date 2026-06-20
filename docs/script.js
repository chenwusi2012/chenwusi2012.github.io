const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".photo-card");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
let activeCard = null;

document.getElementById("year").textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      const isMatch = selected === "all" || card.dataset.location === selected;
      card.style.display = isMatch ? "block" : "none";
    });
  });
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

cards.forEach((card) => {
  const title = card.querySelector("figcaption strong").textContent;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${title} larger`);

  card.addEventListener("click", () => openLightbox(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(card);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
