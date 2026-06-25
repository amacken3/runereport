import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page auth-page">
      <h1>Login</h1>
      <p>Log in to view your saved RuneReport positions.</p>

      {error && <p className="error-message">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>

      <p>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}

export default LoginPage;