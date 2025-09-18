import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function will be called on app load and when user logs in
  const loadUserFromToken = async () => {
    const token = localStorage.getItem("token");
    console.log("Loading user from token:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verifyToken(token);
      console.log("User loaded from token:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user from token:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response.data;

      // Store token immediately
      localStorage.setItem("token", token);

      // IMPORTANT: Update user state immediately
      setUser(userData);

      console.log("Login successful, user set:", userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authAPI.register(email, password);
      const { user: userData, token } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loadUserFromToken, // Export this function so we can call it after login
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
