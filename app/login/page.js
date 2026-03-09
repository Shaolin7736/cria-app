"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email, password, redirect: false
    });
    if (res?.error) setError("Email ou mot de passe incorrect");
    else window.location.href = "/";
  };

  return (
    <div style={{maxWidth:400, margin:"100px auto", padding:24, fontFamily:"sans-serif"}}>
      <h1 style={{color:"#6b2500"}}>CRIA — Connexion</h1>
      {error && <p style={{color:"red"}}>{error}</p>}
      <div style={{display:"flex", flexDirection:"column", gap:12}}>
        <input type="email" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)}
          style={{padding:8, fontSize:15, border:"1px solid #ccc", borderRadius:4}} />
        <input type="password" placeholder="Mot de passe"
          value={password} onChange={e=>setPassword(e.target.value)}
          style={{padding:8, fontSize:15, border:"1px solid #ccc", borderRadius:4}} />
        <button onClick={handleSubmit}
          style={{padding:10, background:"#b84c0a", color:"white",
            border:"none", borderRadius:4, fontSize:15, cursor:"pointer"}}>
          Se connecter
        </button>
      </div>
    </div>
  );
}
