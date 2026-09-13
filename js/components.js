const rottaIniziale = window.location.hash.slice(1);
if (rottaIniziale) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

async function caricaComponente(id, percorso) {
  const risposta = await fetch(percorso);

  if (!risposta.ok) {
    throw new Error(`Errore nel caricamento di ${percorso}`);
  }

  document.getElementById(id).innerHTML = await risposta.text();
}

const pages = {
  home: "pages/home.html",
  "chi-siamo": "pages/chi-siamo.html",
  sostenibilita: "pages/sostenibilita.html",
  report: "pages/sostenibilita.html"
};

async function caricaPagina(rottaForzata) {
  const rotta = rottaForzata || window.location.hash.slice(1) || "home";
  const percorso = pages[rotta] || pages.home;
  const risposta = await fetch(percorso);

  document.getElementById("contenuto").innerHTML = risposta.ok
    ? await risposta.text()
    : "<h1>Pagina non trovata</h1>";

  // Evidenzia il link corretto nella navbar
  const rottaNormalizzata = rotta in pages ? rotta : "home";
  window.setActiveNavLink?.(rottaNormalizzata);

  // Navbar trasparente solo in home (si colora dopo l'hero)
  window.initNavbarAppearance?.(rottaNormalizzata);

  // Riavvia le interazioni (reveal on scroll, contatori KPI)
  window.initPageInteractions?.();

  if (rottaForzata) {
    history.replaceState(null, "", `#${rottaForzata}`);
  }

  document.getElementById(rotta)?.scrollIntoView({ behavior: "smooth" });

  // Chiude il menu laterale dopo aver scelto una pagina
  const offcanvasElement = document.getElementById("offcanvasNavbar");

  if (offcanvasElement) {
    const menu = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    menu.hide();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await caricaComponente("navbar", "components/navbar.html");
  window.initNavbarBehavior?.();

  await caricaComponente("footer", "components/footer.html");
  window.initFooterInteractions?.();

  await caricaPagina(rottaIniziale);
});

window.addEventListener("hashchange", () => caricaPagina());