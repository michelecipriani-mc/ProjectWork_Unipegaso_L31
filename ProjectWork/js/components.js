async function caricaComponente(id, percorso) {
  const risposta = await fetch(percorso);

  if (!risposta.ok) {
    throw new Error(`Errore nel caricamento di ${percorso}`);
  }

  document.getElementById(id).innerHTML = await risposta.text();
}

async function caricaPagina() {
  const rotta = window.location.hash.slice(1) || "home";

  const pages = {
    home: "pages/home.html",
    "chi-siamo": "pages/chi-siamo.html",
    contatti: "pages/contatti.html"
  };

  const percorso = pages[rotta] || pages.home;
  const risposta = await fetch(percorso);

  document.getElementById("contenuto").innerHTML = risposta.ok
    ? await risposta.text()
    : "<h1>Pagina non trovata</h1>";

  // Chiude il menu laterale dopo aver scelto una pagina
  const offcanvasElement = document.getElementById("offcanvasNavbar");

  if (offcanvasElement) {
    const menu = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    menu.hide();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await caricaComponente("navbar", "components/navbar.html");
  await caricaComponente("footer", "components/footer.html");

  await caricaPagina();
});

window.addEventListener("hashchange", caricaPagina);