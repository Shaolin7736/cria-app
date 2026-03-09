import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { encode } from "next-auth/jwt";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  
  const token = await encode({
    token: { email: session.user.email },
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  redirect(`/formulaire.html?token=${token}`);
}
