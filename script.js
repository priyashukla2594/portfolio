// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close menu when a nav link is clicked (mobile)
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Add .scrolled class to navbar on scroll
const nav = document.querySelector(".nav");
const onScroll = () => {
  if (window.scrollY > 8) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Contact form: inline feedback instead of alert
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.textContent = "Please fill out every field.";
    status.style.color = "#dc2626";
    return;
  }

  status.style.color = "";
  status.textContent = "Thanks! Your message has been sent.";
  form.reset();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Projects slider
const slider = document.getElementById("projects-slider");
if (slider) {
  const track = slider.querySelector(".slider-track");
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector(".slider-prev");
  const nextBtn = slider.querySelector(".slider-next");
  const dotsWrap = slider.querySelector(".slider-dots");

  let index = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll(".slider-dot");

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // Keyboard nav when slider is focused
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      goTo(diff < 0 ? index + 1 : index - 1);
      startAutoplay();
    }
  }, { passive: true });

  // Autoplay: advance every 2s, pause on hover, reset on user interaction
  const AUTOPLAY_MS = 4000;
  let autoplayId = null;

  function startAutoplay() {
    stopAutoplay();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayId = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  [prevBtn, nextBtn, ...dots].forEach((el) => {
    el.addEventListener("click", startAutoplay);
  });

  update();
  startAutoplay();
}
