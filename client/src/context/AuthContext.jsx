import { createContext, useEffect, useState } from "react";

import { getCurrentUser, loginUser, signupUser } from "../api/authApi";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("runereport_token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch {
        localStorage.removeItem("runereport_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, [token]);

  async function login(credentials) {
    const data = await loginUser(credentials);

    localStorage.setItem("runereport_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);

    return data.user;
  }

  async function signup(userData) {
    const data = await signupUser(userData);

    localStorage.setItem("runereport_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem("runereport_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;