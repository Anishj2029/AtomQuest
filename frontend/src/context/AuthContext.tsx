import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { authApi, type ApiUser, type RegisterPayload } from "@/lib/api";
import type { UserRole } from "@/types";

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (body: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  rolePath: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const rolePaths: Record<UserRole, string> = {
  employee: "/employee",
  manager: "/manager",
  admin: "/admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    try {
      const raw = localStorage.getItem("goaltrack_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("goaltrack_token")
  );

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("goaltrack_user", JSON.stringify(data.user));
      localStorage.setItem("goaltrack_token", data.token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (body: RegisterPayload): Promise<boolean> => {
    try {
      const data = await authApi.register(body);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("goaltrack_user", JSON.stringify(data.user));
      localStorage.setItem("goaltrack_token", data.token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("goaltrack_user");
    localStorage.removeItem("goaltrack_token");
  }, []);

  const rolePath = useCallback((role: UserRole) => rolePaths[role], []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, rolePath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
