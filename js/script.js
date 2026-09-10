// Initialization for ES Users
import { Input, initMDB } from "mdb-ui-kit";

initMDB({ Input });

//Interazione del Front-End

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Banner (chiudibile) ---------- */
  const banner = document.getElementById('thesisBanner');
  const closeBanner = document.getElementById('closeBanner');
  closeBanner?.addEventListener('click', () => {
    banner.hidden = true;
  });

  /* ---------- Header: ombra allo scroll ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Nav link attivo in base alla sezione visibile ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.mission-card, .values-list .value, .timeline li, .activity-card, .kpi-card, .esg-block, .report-card, .mission-grid'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Contatori animati per i parametri di crescita ---------- */
  const kpiValues = document.querySelectorAll('.kpi-value');

  const withThousandsSeparator = (n) =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const formatValue = (num, el) => {
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isInt = el.dataset.format === 'int';
    const rounded = isInt ? Math.round(num) : Math.round(num * 10) / 10;
    const formatted = isInt
      ? withThousandsSeparator(rounded)
      : rounded.toString().replace('.', ',');
    return `${prefix}${formatted}${suffix}`;
  };

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = formatValue(current, el);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatValue(target, el);
    };
    requestAnimationFrame(step);
  };

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  kpiValues.forEach(el => kpiObserver.observe(el));

});