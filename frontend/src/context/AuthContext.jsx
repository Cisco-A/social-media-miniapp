/* eslint-disable no-useless-catch */
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token) {
        try {
          // Actual endpoint to fetch current user profile
          // const response = await api.get("/user");
          // setUser(response.data.user);
        } catch (error) {
          console.error("Session verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUserSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (displayName, email, password, gender) => {
    try {
      const response = await api.post("/auth/register", {
        displayName,
        email,
        password,
        gender,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      const { token, user } = response.data;
      setUser(user);
      setToken(token);
      localStorage.removeItem("email");
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (email, purpose) => {
    try {
      const response = await api.post("/auth/resend-otp", {
        email,
        purpose,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    resetPassword,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
