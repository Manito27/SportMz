const kickoff = new Date("2026-10-25T22:00:00+02:00").getTime();
const countdownLabel = document.querySelector("#countdown-label");
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = kickoff - Date.now();

  if (remaining <= 0) {
    Object.values(countdownFields).forEach((field) => {
      field.textContent = "00";
    });
    countdownLabel.textContent = "O horário de início do jogo chegou";
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  countdownFields.days.textContent = String(Math.floor(seconds / 86400)).padStart(2, "0");
  countdownFields.hours.textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(seconds % 60).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    siteNav.classList.remove("is-open");
  });
});

const oddsOptions = document.querySelectorAll(".odds-option");
const oddsFeedback = document.querySelector("#odds-feedback");

oddsOptions.forEach((option) => {
  option.addEventListener("click", () => {
    oddsOptions.forEach((item) => {
      item.classList.remove("is-selected");
      item.setAttribute("aria-pressed", "false");
    });

    option.classList.add("is-selected");
    option.setAttribute("aria-pressed", "true");
    oddsFeedback.textContent = `Cenário selecionado: ${option.dataset.outcome}. As cotações podem mudar.`;
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const carousel = document.querySelector("#photo-carousel");
const carouselTrack = document.querySelector("#carousel-track");
const carouselSlides = [...carousel.querySelectorAll(".carousel-slide")];
const carouselDots = [...carousel.querySelectorAll(".carousel-dot")];
const carouselCaption = document.querySelector("#carousel-caption");
const carouselStatus = document.querySelector("#carousel-status");
let activeSlide = 0;
let carouselTimer;

function showCarouselSlide(index) {
  activeSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
  carouselSlides.forEach((slide, slideIndex) => {
    slide.setAttribute("aria-hidden", String(slideIndex !== activeSlide));
  });
  carouselDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
  carouselCaption.textContent = activeSlide === 0 ? "Barcelona em destaque" : "Real Madrid em destaque";
  carouselStatus.textContent = `0${activeSlide + 1} / 0${carouselSlides.length}`;
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
}

function startCarousel() {
  stopCarousel();
  carouselTimer = window.setInterval(() => showCarouselSlide(activeSlide + 1), 5000);
}

document.querySelector("#carousel-previous").addEventListener("click", () => {
  showCarouselSlide(activeSlide - 1);
  startCarousel();
});
document.querySelector("#carousel-next").addEventListener("click", () => {
  showCarouselSlide(activeSlide + 1);
  startCarousel();
});
carouselDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showCarouselSlide(Number(dot.dataset.slide));
    startCarousel();
  });
});
showCarouselSlide(0);
startCarousel();

const registrationModal = document.querySelector("#registration-modal");
const pageShell = document.querySelector(".page-shell");
const registerLink = registrationModal.querySelector(".popup-register");
const stickyRegister = registrationModal.querySelector(".sticky-register");
const closeRegistrationPopup = () => {
  registrationModal.setAttribute("aria-hidden", "true");
  document.body.appendChild(stickyRegister);
  pageShell.removeAttribute("inert");
  document.body.classList.remove("modal-open");
  document.querySelector(".site-header .brand").focus();
};

pageShell.setAttribute("inert", "");
registerLink.focus({ preventScroll: true });

registrationModal.querySelectorAll("[data-close-register]").forEach((button) => {
  button.addEventListener("click", closeRegistrationPopup);
});

registrationModal.addEventListener("click", (event) => {
  if (event.target === registrationModal) closeRegistrationPopup();
});

registrationModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRegistrationPopup();
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = [...registrationModal.querySelectorAll("a[href], button:not([disabled])")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
