import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";

export default async function Formulaire() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const html = readFileSync(join(process.cwd(), "public", "formulaire.html"), "utf8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatch ? styleMatch.join("\n") : "";

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono&display=swap" rel="stylesheet" />
        <div dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body dangerouslySetInnerHTML={{ __html: body }} />
    </html>
  );
}
