const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');
const counters = document.querySelectorAll('[data-count]');
const statsSection = document.querySelector('#stats');
const reviewSlides = [...document.querySelectorAll('.review-slide')];
const reviewPrev = document.querySelector('.review-btn.prev');
const reviewNext = document.querySelector('.review-btn.next');
const reviewDots = document.querySelector('.review-dots');
let activeReview = 0;
let reviewTimer;
let countersStarted = false;

// Закрывает мобильное меню после перехода по ссылке или нажатия Escape.
function closeMenu() {
  body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

// Управляет слайдером отзывов и синхронизирует активную точку навигации.
function setActiveReview(index) {
  activeReview = (index + reviewSlides.length) % reviewSlides.length;

  reviewSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === activeReview);
  });

  document.querySelectorAll('.review-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === activeReview);
    dot.setAttribute('aria-selected', String(dotIndex === activeReview));
  });
}

function startReviewAutoplay() {
  window.clearInterval(reviewTimer);
  reviewTimer = window.setInterval(() => setActiveReview(activeReview + 1), 5200);
}

// Плавная анимация чисел в блоке статистики.
function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(target * easedProgress).toLocaleString('ru-RU');

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Дополнительный плавный скролл для браузеров и точного закрытия мобильного меню.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));

    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (reviewDots && reviewSlides.length) {
  reviewSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `review-dot${index === 0 ? ' is-active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    dot.setAttribute('aria-selected', String(index === 0));
    dot.addEventListener('click', () => {
      setActiveReview(index);
      startReviewAutoplay();
    });
    reviewDots.append(dot);
  });

  reviewPrev?.addEventListener('click', () => {
    setActiveReview(activeReview - 1);
    startReviewAutoplay();
  });

  reviewNext?.addEventListener('click', () => {
    setActiveReview(activeReview + 1);
    startReviewAutoplay();
  });

  startReviewAutoplay();
}

// Блоки появляются при прокрутке, чтобы интерфейс ощущался премиально и живо.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealElements.forEach((element) => revealObserver.observe(element));

const statsObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
}, { threshold: 0.35 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('is-visible', window.scrollY > 640);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});
