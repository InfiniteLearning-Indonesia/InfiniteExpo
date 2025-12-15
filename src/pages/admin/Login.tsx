// src/pages/admin/Login.tsx
import { useState } from "react";
import { login } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    const res = await login(email, password);
    localStorage.setItem("token", res.data.token);
    nav("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-secondary">Admin Login</h1>
        <input
          className="w-full p-2 mb-3 bg-black border border-zinc-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 bg-black border border-zinc-700"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={submit}
          className="w-full bg-secondary text-black py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
