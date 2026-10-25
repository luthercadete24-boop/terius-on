// Authentication Service for managing user sessions and storage
import { apiRequest } from "./api";
import { Usuario } from "../types";

const USER_STORAGE_KEY = "lingoprogress_user";

export const authService = {
  getStoredUser(): Usuario | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      // Migrate legacy default user name if applicable
      if (parsed && parsed.id_usuario === 1 && parsed.nome === "Luther Cadete") {
        parsed.nome = "Teríus";
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  setStoredUser(user: Usuario): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  clearStoredUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  async login(email: string, senha: string): Promise<{ success: boolean; user: Usuario }> {
    return apiRequest<{ success: boolean; user: Usuario }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha })
    });
  },

  async register(nome: string, email: string, senha: string): Promise<{ success: boolean; user: Usuario }> {
    return apiRequest<{ success: boolean; user: Usuario }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha })
    });
  }
};
