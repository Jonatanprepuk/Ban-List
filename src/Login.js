import { useState } from 'react';
import { useAuth } from "./authContext";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(email, password);
        window.location.href = "/admin";
      } catch (error) {
        alert("Failed to log in:", error.message);
      }};
  
    return (
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    );
  }