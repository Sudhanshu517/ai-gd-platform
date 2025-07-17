import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please enter email and password");

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token); // ✅ Store JWT
      alert("Login successful!");
      navigate("/"); // Redirect to homepage or CreateSession
    } catch (err) {
      console.error(err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
