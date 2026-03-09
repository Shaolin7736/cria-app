import { getServerSession } from "next-auth";
import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const res = await db.execute("SELECT * FROM fiches ORDER BY id DESC");
  return NextResponse.json(res.rows);
}

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const { nom, prenom, annee, genre, ...rest } = body;
  await db.execute({
    sql: "INSERT INTO fiches (nom, prenom, annee, genre, data) VALUES (?,?,?,?,?)",
    args: [nom, prenom, annee, genre, JSON.stringify(rest)]
  });
  return NextResponse.json({ ok: true });
}
```

Sauvegardez **Cmd+S** et fermez.

---

**Fichier 2 — PUT et DELETE pour modifier et supprimer une fiche**
```
mkdir -p ~/Desktop/cria-app/app/api/fiches/\[id\]
touch ~/Desktop/cria-app/app/api/fiches/\[id\]/route.js
open -e ~/Desktop/cria-app/app/api/fiches/\[id\]/route.js