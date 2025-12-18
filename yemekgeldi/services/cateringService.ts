import { api } from "@/lib/api/base";
import type { Catering } from "@/lib/types";

export const cateringService = {
  async getAll() {
    return api.get<Catering[]>("/catering");
  },

  async getById(id: string) {
    return api.get<Catering>(`/catering/${id}`);
  },

  async create(data: Partial<Catering>) {
    return api.post<Catering>("/catering", data);
  },

  async update(id: string, data: Partial<Catering>) {
    return api.put<Catering>(`/catering/${id}`, data);
  },

  async suspend(id: string) {
    return api.post<void>(`/catering/${id}/suspend`, {});
  },

  async activate(id: string) {
    return api.post<void>(`/catering/${id}/activate`, {});
  },
};

