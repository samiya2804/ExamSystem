"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

interface Course {
  _id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  course?: Course | null;
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("exam_system_token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          course: decoded.course || null,
        });
      } catch (err) {
        console.error("Token decode error:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
