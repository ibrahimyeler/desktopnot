import { api } from "@/lib/api/base";
import type { User } from "@/lib/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    return api.post<LoginResponse>("/auth/login", credentials);
  },

  async logout() {
    return api.post<void>("/auth/logout", {});
  },

  async resetPassword(email: string) {
    return api.post<void>("/auth/reset-password", { email });
  },

  async getCurrentUser() {
    return api.get<User>("/auth/me");
  },
};

