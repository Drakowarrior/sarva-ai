import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("sarvaai_token") || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const validateToken = async () => {
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setCheckingAuth(false);
      return;
    }

    try {
      // Set standard authorization token
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        if (res.data.user?.user_id) {
          localStorage.setItem("sarvaai_user_id", res.data.user.user_id);
        }
      } else {
        // Token invalid
        handleLogoutDirect();
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      handleLogoutDirect();
    } finally {
      setCheckingAuth(false);
    }
  };

  // Validate token on mount or when token changes
  useEffect(() => {
    validateToken();
  }, [token]);

  const handleLogoutDirect = () => {
    localStorage.removeItem("sarvaai_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        const { token: userToken, user: userProfile } = res.data;
        localStorage.setItem("sarvaai_token", userToken);
        if (userProfile?.user_id) {
          localStorage.setItem("sarvaai_user_id", userProfile.user_id);
        }
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(userProfile);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${userProfile.username}! 👋`);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Invalid credentials. Please try again.";
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const register = async (usernameOrDetails, email, password) => {
    try {
      let payload;
      if (typeof usernameOrDetails === "object") {
        payload = usernameOrDetails;
      } else {
        payload = { 
          username: usernameOrDetails, 
          fullName: usernameOrDetails, 
          email, 
          password, 
          accountType: "personal" 
        };
      }
      const res = await api.post("/auth/register", payload);
      if (res.data.success) {
        const { token: userToken, user: userProfile } = res.data;
        localStorage.setItem("sarvaai_token", userToken);
        if (userProfile?.user_id) {
          localStorage.setItem("sarvaai_user_id", userProfile.user_id);
        }
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(userProfile);
        setIsAuthenticated(true);
        
        const welcomeName = userProfile.fullName || userProfile.username;
        toast.success(`Account created! Welcome, ${welcomeName}! 🚀`);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Registration failed. Try again.";
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };


  const logout = () => {
    handleLogoutDirect();
    toast.success("Signed out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        checkingAuth,
        login,
        register,
        logout,
        checkAuthStatus: validateToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
