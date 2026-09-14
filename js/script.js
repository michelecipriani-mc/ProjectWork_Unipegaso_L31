function misuraOffsetHeader() {
  const banner = document.getElementById('thesisBanner');
  const navbar = document.querySelector('#navbar .navbar');

  const bannerH = banner && !banner.hidden ? banner.offsetHeight : 0;
  const navbarH = navbar ? navbar.offsetHeight : 56;

  document.documentElement.style.setProperty('--banner-h', `${bannerH}px`);
  document.documentElement.style.setProperty('--navbar-h', `${navbarH}px`);
}

/* ---------- Gestione Banner: se chiuso, la navbar sale in top:0 ---------- */
function initNavbarBehavior() {
  const banner = document.getElementById('thesisBanner');
  const closeBanner = document.getElementById('closeBanner');

  closeBanner?.addEventListener('click', () => {
    banner.hidden = true;
    misuraOffsetHeader();
  });

  misuraOffsetHeader();
  window.addEventListener('resize', misuraOffsetHeader);
}

/* ---------- Form newsletter nel footer (demo: nessun invio reale) ---------- */
function initFooterInteractions() {
  const form = document.getElementById('newsletterForm');
  const nota = document.getElementById('newsletterNote');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    form.reset();
    nota.hidden = false;
  });
}

/* ---------- Evidenzia nella navbar il link corrispondente alla rotta corrente ---------- */
function setActiveNavLink(rottaCorrente) {

  const rotta = rottaCorrente === 'report' ? 'sostenibilita' : rottaCorrente;

  document.querySelectorAll('#navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkRoute = href.startsWith('#') ? (href.slice(1) || 'home') : '';
    link.classList.toggle('active', linkRoute === rotta);
  });
}

let gestoreScrollNavbar = null;

function initNavbarAppearance(rotta) {
  const nav = document.querySelector('#navbar .navbar');
  const contenuto = document.getElementById('contenuto');
  if (!nav || !contenuto) return;

  // Rimuove un eventuale listener lasciato da una precedente visita alla home
  if (gestoreScrollNavbar) {
    window.removeEventListener('scroll', gestoreScrollNavbar);
    window.removeEventListener('resize', gestoreScrollNavbar);
    gestoreScrollNavbar = null;
  }

  if (rotta !== 'home') {
    // Pagine interne: navbar non trasparente, gestione contenuto
    contenuto.classList.add('with-navbar-offset');
    nav.classList.remove('navbar-transparent');
    return;
  }

  contenuto.classList.remove('with-navbar-offset');

  const h = contenuto.querySelector('.h');

  gestoreScrollNavbar = () => {
    const soglia = Math.max((h?.offsetHeight || 0) - nav.offsetHeight, 0);
    nav.classList.toggle('navbar-transparent', window.scrollY < soglia);
  };

  gestoreScrollNavbar();
  window.addEventListener('scroll', gestoreScrollNavbar, { passive: true });
  window.addEventListener('resize', gestoreScrollNavbar);
}

/* ---------- avvia le interazioni della pagina appena caricata ---------- */
function initPageInteractions() {
  const contenuto = document.getElementById('contenuto');
  if (!contenuto) return;

  /* Reveal on scroll */
  const revealTargets = contenuto.querySelectorAll(
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

  /* Contatori animati per i parametri di crescita */
  const kpiValues = contenuto.querySelectorAll('.kpi-value');

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
      const eased = 1 - Math.pow(1 - progress, 3);
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
}

window.initNavbarBehavior = initNavbarBehavior;
window.setActiveNavLink = setActiveNavLink;
window.initNavbarAppearance = initNavbarAppearance;
window.initPageInteractions = initPageInteractions;