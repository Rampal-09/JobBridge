import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutApi } from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const res = await getMe();
        // getMe returns { data: user }
        const userData = res.data || res.user || res;
        console.log("getMe response:", res);
        console.log("Extracted user data:", userData);
        console.log("User role:", userData?.role);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.log("User not logged in or session expired:", err);
        setUser(null);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = (userData) => {
    console.log("Setting user in context:", userData);
    setUser(userData);
    setError(null);
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      setError(null);
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
