"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ? àªç¡ session µÍ¹ reload
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/auth/me`,
          { credentials: "include" }
        );

        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // ? Email / Password login
  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/member/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    setUser(json.data);
    router.replace(
      json.data.role === "ADMIN"
        ? "/admin/dashboard"
        : "/member/dashboard"
    );
    setLoading(false);
  };

  // ? Google OAuth
  const loginWithGoogle = () => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_API}/auth/google`;
  };

  // ? Logout
  const logout = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
