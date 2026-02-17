"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUser, createUser } from "../firebase/collections";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Načtení uživatelských dat
        try {
          let data = await getUser(firebaseUser.uid);
          if (!data) {
            // Vytvoření nového uživatele
            console.log("Vytváření nového uživatele:", firebaseUser.uid);
            await createUser(firebaseUser.uid, firebaseUser.email || "", firebaseUser.displayName || undefined);
            // Počkáme chvíli a zkusíme znovu načíst
            await new Promise(resolve => setTimeout(resolve, 500));
            data = await getUser(firebaseUser.uid);
          }
          setUserData(data);
        } catch (error: any) {
          console.error("Chyba při načítání/vytváření uživatele:", error);
          // I při chybě nastavíme user, aby aplikace fungovala
          setUserData({
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined,
            createdAt: new Date(),
            streak: 0,
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
