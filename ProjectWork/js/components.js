async function caricaComponente(id, percorso) {
  const risposta = await fetch(percorso);

  if (!risposta.ok) {
    throw new Error(`Impossibile caricare: ${percorso}`);
  }

  document.getElementById(id).innerHTML = await risposta.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  await caricaComponente("navbar", "components/navbar.html");
  await caricaComponente("footer", "components/footer.html");
});