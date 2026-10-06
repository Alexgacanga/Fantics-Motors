import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authApi, getApiError } from "../services/api";
import { AuthContext, useAuth } from "./auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(
    Boolean(sessionStorage.getItem("fantics_access_token")),
  );

  useEffect(() => {
    if (!sessionStorage.getItem("fantics_access_token")) return;

    authApi
      .currentUser()
      .then((currentUser) => setUser(currentUser.user || currentUser))
      .catch(() => {
        sessionStorage.removeItem("fantics_access_token");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);
      const accessToken = result.access || result.access_token;
      if (!accessToken)
        throw new Error("The login response did not include an access token.");

      sessionStorage.setItem("fantics_access_token", accessToken);
      const currentUser = result.user || (await authApi.currentUser());
      const normalizedUser = currentUser.user || currentUser;
      if (
        !normalizedUser.is_staff &&
        !normalizedUser.is_superuser &&
        normalizedUser.role !== "admin"
      ) {
        sessionStorage.removeItem("fantics_access_token");
        throw new Error("This account does not have administrator access.");
      }
      setUser(normalizedUser);
    } catch (error) {
      sessionStorage.removeItem("fantics_access_token");
      throw new Error(error.response ? getApiError(error) : error.message, {
        cause: error,
      });
    }
  };

  const logout = () => {
    sessionStorage.removeItem("fantics_access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white grid place-items-center p-6">
        <p role="status" className="text-sm text-gray-300">
          Checking your admin session...
        </p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user.is_staff && !user.is_superuser && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
