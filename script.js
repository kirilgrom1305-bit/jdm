const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');
const carouselTrack = document.querySelector('.carousel-track');
const carouselCards = [...document.querySelectorAll('.car-card')];
const prevButton = document.querySelector('.carousel-btn.prev');
const nextButton = document.querySelector('.carousel-btn.next');
const counters = document.querySelectorAll('[data-count]');
let activeSlide = 0;
let countersStarted = false;

function closeMenu() {
  body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function setActiveSlide(index) {
  activeSlide = (index + carouselCards.length) % carouselCards.length;
  carouselCards.forEach((card, cardIndex) => {
    card.classList.toggle('is-active', cardIndex === activeSlide);
  });
  carouselCards[activeSlide].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(target * eased).toLocaleString('ru-RU');

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

menuToggle.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

prevButton.addEventListener('click', () => setActiveSlide(activeSlide - 1));
nextButton.addEventListener('click', () => setActiveSlide(activeSlide + 1));

carouselTrack.addEventListener('scroll', () => {
  const cardWidth = carouselCards[0].getBoundingClientRect().width;
  const gap = Number.parseFloat(getComputedStyle(carouselTrack).columnGap) || 0;
  const index = Math.round(carouselTrack.scrollLeft / (cardWidth + gap));
  activeSlide = Math.max(0, Math.min(index, carouselCards.length - 1));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealElements.forEach((element) => revealObserver.observe(element));

const factsObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
}, { threshold: 0.35 });

const factsSection = document.querySelector('#facts');
if (factsSection) {
  factsObserver.observe(factsSection);
}

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 640);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});
