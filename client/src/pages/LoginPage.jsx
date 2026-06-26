import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import styles from "./LoginPage.module.css";

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
    <main className={styles.page}>
      <section className={styles.authCard}>
        <p className={styles.eyebrow}>Welcome back</p>
        
        <p className={styles.subtitle}>
          Log in to view your saved RuneReport positions.
        </p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Username
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.field}>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>

        <p className={styles.switchText}>
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;