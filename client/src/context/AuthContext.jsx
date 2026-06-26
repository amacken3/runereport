import { createContext, useEffect, useState } from "react";

import { getCurrentUser, loginUser, signupUser } from "../api/authApi";

export const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "runereport_token";
const REFRESH_TOKEN_KEY = "runereport_refresh_token";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
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
        setToken(localStorage.getItem(ACCESS_TOKEN_KEY));
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
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

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

    setToken(data.access_token);
    setUser(data.user);

    return data.user;
  }

  async function signup(userData) {
    const data = await signupUser(userData);

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

    setToken(data.access_token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

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