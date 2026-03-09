const fs = require("fs");
let html = fs.readFileSync("/Users/a1r9/Desktop/cria-app/public/formulaire.html", "utf8");
const lines = html.split("\n");

// Ligne 575 : remplace chargement records depuis localStorage
lines[574] = "let records = [];";

// Ligne 1576 : supprime sauvegarde records dans localStorage
lines[1575] = "// records sauvegardés via API";

// Ligne 1620 : remplace effacement localStorage records
lines[1619] = "  records=[];updateStats();renderRecords();fetch('/api/fiches',{method:'DELETE'});";

html = lines.join("\n");

// Ajoute loadRecords avant la fermeture du script
const loadFn = `
async function loadRecords() {
  const res = await fetch('/api/fiches');
  if(res.status === 401) { window.location.href = '/login'; return; }
  const raw = await res.json();
  records = raw.map(r => {
    const data = r.data ? JSON.parse(r.data) : {};
    return { ...data, id: r.id, nom: r.nom, prenom: r.prenom, annee: r.annee, genre: r.genre };
  });
  renderRecords();
  updateStats();
}
`;

// Ajoute loadRecords() au chargement de la page
const initCall = `
document.addEventListener('DOMContentLoaded', function() {
  loadRecords();
});
`;

html = html.replace("</script>", loadFn + initCall + "\n</script>");

fs.writeFileSync("/Users/a1r9/Desktop/cria-app/public/formulaire.html", html);
console.log("Patch appliqué !");
