function misuraOffsetHeader() {
  const banner = document.getElementById('thesisBanner');
  const navbar = document.querySelector('#navbar .navbar');

  const bannerH = banner && !banner.hidden ? banner.offsetHeight : 0;
  const navbarH = navbar ? navbar.offsetHeight : 56;

  document.documentElement.style.setProperty('--banner-h', `${bannerH}px`);
  document.documentElement.style.setProperty('--navbar-h', `${navbarH}px`);
}

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

function setActiveNavLink(rottaCorrente) {

  const rotta = rottaCorrente === 'report' ? 'sostenibilita' : rottaCorrente;

  document.querySelectorAll('#navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkRoute = href.startsWith('#') ? (href.slice(1) || 'home') : '';
    link.classList.toggle('active', linkRoute === rotta);
  });
}

/* ---------- avvio interazioni della pagina appena caricata ---------- */
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
window.initPageInteractions = initPageInteractions;