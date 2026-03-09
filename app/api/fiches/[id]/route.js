import { checkAuth } from "@/lib/checkAuth";
import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function PUT(req, { params }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const { nom, prenom, annee, genre, ...rest } = body;
  await db.execute({
    sql: "UPDATE fiches SET nom=?,prenom=?,annee=?,genre=?,data=? WHERE id=?",
    args: [nom, prenom, annee, genre, JSON.stringify(rest), params.id]
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await db.execute({
    sql: "DELETE FROM fiches WHERE id=?",
    args: [params.id]
  });
  return NextResponse.json({ ok: true });
}
