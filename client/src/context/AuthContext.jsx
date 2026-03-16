import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  const login = async (email, password) => {
    const result = await adminLogin(email, password);
    const nextToken = result?.token || result?.accessToken || result?.jwt;

    if (!nextToken) {
      throw new Error("Authentication token was not returned by the server.");
    }

    setToken(nextToken);
    navigate("/admin/dashboard");
    return nextToken;
  };

  const logout = () => {
    setToken(null);
    navigate("/admin/login");
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: Boolean(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
