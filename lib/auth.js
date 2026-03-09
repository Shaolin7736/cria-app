import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "CRIA",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        const res = await db.execute({
          sql: "SELECT * FROM users WHERE email = ?",
          args: [credentials.email]
        });
        const user = res.rows[0];
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
};
