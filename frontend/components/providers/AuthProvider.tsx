"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/useAuthStore";
import { api } from "@/lib/axios"; // ton instance axios

export default function AuthProvider({children}: {children: React.ReactNode}) {
  const loadUser = useAuthStore((s) => s.loadUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const run = async () => {
      if (typeof window === "undefined") return;

      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      // 1) Aucun token → logout
      if (!access && !refresh) {
        logout();
        return;
      }

      // 2) Access présent → on charge direct l'utilisateur
      if (access) {
        try {
          await loadUser(); // /me
          return; // OK
        } catch (err: unknown) {
          if (err instanceof Error && "response" in err) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
              localStorage.removeItem("access");
            } else {
              return;
            }
          }
        }
      }

      // 3) Ici : access manquant ou expiré
      // Si refresh existe → silent refresh
      if (refresh) {
        try {
          const res = await api.post("/token/refresh/", { refresh });
          const newAccess = res.data.access;

          localStorage.setItem("access", newAccess);

          await loadUser();
          return;
        } catch {
          // Refresh invalide → logout
          logout();
          return;
        }
      }

      // 4) Ici : access expiré + refresh absent → logout
      logout();
    };

    run();
  }, [loadUser, logout]);

  return <>{children}</>;
}