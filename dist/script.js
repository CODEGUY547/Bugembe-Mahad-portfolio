const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const meter = document.querySelector('.scroll-meter span');
const indexNumber = document.querySelector('.index-number');
const indexName = document.querySelector('.index-name');
const storedTheme = localStorage.getItem('bm-theme');

if (storedTheme === 'dark' || storedTheme === 'light') root.dataset.theme = storedTheme;

themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('bm-theme', next);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#07121b' : '#f1eee4');
});

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const observedSections = [...document.querySelectorAll('.observed-section')];

const updateScrollMeter = () => {
  const maximum = document.documentElement.scrollHeight - innerHeight;
  meter.style.width = `${maximum > 0 ? (scrollY / maximum) * 100 : 0}%`;
  const active = observedSections.reduce((current, section) => {
    return section.getBoundingClientRect().top <= innerHeight * 0.42 ? section : current;
  }, observedSections[0]);
  if (active) {
    indexNumber.textContent = active.dataset.index;
    indexName.textContent = active.dataset.label;
  }
};

addEventListener('scroll', updateScrollMeter, { passive: true });
addEventListener('resize', updateScrollMeter);
updateScrollMeter();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});
