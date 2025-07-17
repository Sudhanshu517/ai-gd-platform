// client/src/pages/Auth.tsx
import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful! 🎉");
      } else {
        await axios.post(`${API_BASE}/api/auth/register`, { username, email, password });
        setMessage("Registered successfully! Switch to login.");
      }
    } catch (err) {
      setMessage("Error: " + (err as any).response?.data?.error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-3 text-green-700">{message}</p>
      <button
        className="text-blue-500 mt-2 underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create an account" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Auth;
