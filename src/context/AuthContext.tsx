import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

interface User {
  id: string;
  email: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("guest") === "true") {
      setUser({ id: "guest", email: "Guest", isGuest: true });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("access_token", res.data.access_token);
    sessionStorage.removeItem("guest");
    setUser(res.data.user);
  }

  function loginAsGuest() {
    sessionStorage.setItem("guest", "true");
    localStorage.removeItem("access_token");
    setUser({ id: "guest", email: "Guest", isGuest: true });
  }

  async function logout() {
    const token = localStorage.getItem("access_token");
    if (token) {
      await axios
        .post(`${API}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {});
    }
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("guest");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
