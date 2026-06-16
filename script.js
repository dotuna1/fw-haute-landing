const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

function initCarousel(carousel) {
  const track = carousel.querySelector(".carousel-track");
  const prev = carousel.querySelector('[data-action="prev"]');
  const next = carousel.querySelector('[data-action="next"]');
  const dotsWrap = carousel.querySelector('.dots');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.product-card'));
  if (cards.length === 0) return;

  const getStep = () => Math.max(1, Math.round(track.clientWidth * 0.9));
  const getPageSize = () => Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
  const getPageCount = () => {
    const visibleCount = getPageSize();
    return Math.max(1, Math.ceil(cards.length / visibleCount));
  };

  const createDots = () => {
    if (!dotsWrap) return 0;
    const total = getPageCount();
    dotsWrap.innerHTML = "";
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement('span');
      dot.className = i === 0 ? 'dot active' : 'dot';
      dotsWrap.appendChild(dot);
    }
    return total;
  };

  const updateDots = () => {
    const children = Array.from(dotsWrap.children);
    const maxPage = Math.max(0, getPageCount() - 1);
    const index = Math.min(maxPage, Math.max(0, Math.round(track.scrollLeft / getStep())));
    children.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  const scrollByCard = (dir) => {
    if (!track) return;
    track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
  };

  if (prev && next) {
    prev.addEventListener('click', () => scrollByCard(-1));
    next.addEventListener('click', () => scrollByCard(1));
  }

  if (!dotsWrap) return;

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateDots);
  });
  window.addEventListener('resize', () => {
    createDots();
    updateDots();
  });

  createDots();
}

function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#siteNav');

  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#siteNav');

  document.querySelectorAll('.carousel').forEach(initCarousel);
  initNav();

  // Close mobile menu when selecting a destination
  document.querySelectorAll('#siteNav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!nav || !navToggle || !nav.classList.contains('open')) return;
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
});
