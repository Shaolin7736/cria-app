const fs = require("fs");

const src = fs.readFileSync("/Users/a1r9/Desktop/fiche_bilan_CRIA.html", "utf8");

let out = src

  // saveRecord — remplace localStorage par API POST/PUT
  .replace(
    /function saveRecord\(\)\s*\{[\s\S]*?^}/m,
    `async function saveRecord() {
  if(!checkBtn()) return;
  const r = buildRecord();
  if(editingId !== null) {
    await fetch('/api/fiches/' + editingId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(r)
    });
    cancelEdit();
  } else {
    await fetch('/api/fiches', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(r)
    });
  }
  resetForm();
  await loadRecords();
}`
  )

  // loadRecords — remplace lecture localStorage par API GET
  .replace(
    /function loadRecords\(\)\s*\{[\s\S]*?^}/m,
    `async function loadRecords() {
  const res = await fetch('/api/fiches');
  if(res.status === 401) { window.location.href = '/login'; return; }
  records = await res.json();
  records = records.map(r => {
    const data = r.data ? JSON.parse(r.data) : {};
    return { ...data, id: r.id, nom: r.nom, prenom: r.prenom, annee: r.annee, genre: r.genre };
  });
  renderList();
  renderStats();
}`
  )

  // delRecord — remplace suppression localStorage par API DELETE
  .replace(
    /function delRecord\(id\)\s*\{[\s\S]*?^}/m,
    `async function delRecord(id) {
  if(!confirm('Supprimer cette fiche ?')) return;
  await fetch('/api/fiches/' + id, { method: 'DELETE' });
  await loadRecords();
}`
  );

// Wrap dans une page Next.js
const page = `export default function Page() {
  return (
    <>
      <div id="cria-root" dangerouslySetInnerHTML={{__html: ''}} />
      <script dangerouslySetInnerHTML={{__html: \`
        // Formulaire CRIA intégré
      \`}} />
    </>
  );
}`;

fs.writeFileSync("/Users/a1r9/Desktop/cria-app/public/formulaire.html", out);
console.log("Fichier généré : public/formulaire.html");
