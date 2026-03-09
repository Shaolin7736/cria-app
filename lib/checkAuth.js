import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { decode } from "next-auth/jwt";

export async function checkAuth(req) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || 
    req.headers.get("x-auth-token");
  
  if (token) {
    try {
      const decoded = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (decoded?.email) return true;
    } catch(e) {}
  }
  return false;
}
