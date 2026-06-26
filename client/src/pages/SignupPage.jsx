import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import styles from "./SignupPage.module.css";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.authCard}>
        <p className={styles.eyebrow}>Start tracking</p>
        <p className={styles.subtitle}>
          Create an account to track your OSRS market positions.
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
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
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
            Create Account
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignupPage;