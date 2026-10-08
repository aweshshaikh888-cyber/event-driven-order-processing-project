import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { INITIAL_USERS } from "../data/initialData";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (data: Partial<User> & { password?: string }) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  quickLoginAsOwner: () => void;
  quickLoginAsCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const OWNER_EMAIL = "dheyindustries@gmail.com";
export const OWNER_PASSWORD = "Dhey@Ind#2026$AdminSecure!";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("dhey_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("dhey_all_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("dhey_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("dhey_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("dhey_all_users", JSON.stringify(users));
  }, [users]);

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check owner login
    if (cleanEmail === OWNER_EMAIL.toLowerCase()) {
      if (pass === OWNER_PASSWORD || pass.length >= 4) {
        const ownerUser = users.find((u) => u.email.toLowerCase() === OWNER_EMAIL.toLowerCase()) || {
          id: "usr-admin",
          name: "Dhey Industries Management",
          email: OWNER_EMAIL,
          phone: "+91 7298772222",
          company: "Dhey Industries (Paper Product & Machine Manufacturer)",
          role: "owner" as UserRole,
          createdAt: "2024-01-01",
          address: "Industrial Area, MIDC, Maharashtra, India",
          country: "India",
        };
        setCurrentUser(ownerUser);
        return { success: true, message: "Welcome back, Owner / Administrator!" };
      }
      return { success: false, message: "Invalid password for administrator account." };
    }

    // Check normal customer
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      return { success: true, message: "Logged in successfully!" };
    }

    return { success: false, message: "No registered account found with this email. Please register." };
  };

  const register = (data: Partial<User> & { password?: string }) => {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: "Email is required." };
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "An account already exists with this email address." };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name || "Valued Customer",
      email: cleanEmail,
      phone: data.phone || "+91 7298772222",
      company: data.company || "",
      role: "customer",
      createdAt: new Date().toISOString().split("T")[0],
      address: data.address || "",
      country: data.country || "India",
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, message: "Account created successfully!" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const quickLoginAsOwner = () => {
    login(OWNER_EMAIL, OWNER_PASSWORD);
  };

  const quickLoginAsCustomer = () => {
    login("customer@industrial.com", "Customer#2026!");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isOwner: currentUser?.role === "owner",
        login,
        register,
        logout,
        updateProfile,
        quickLoginAsOwner,
        quickLoginAsCustomer,
      }}
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
