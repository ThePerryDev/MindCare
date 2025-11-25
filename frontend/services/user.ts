// frontend/services/user.ts
import { api } from '@/services/api';

export type UpdateMeInput = Partial<{
  fullName: string;
  email: string;
  phone: string;
  birthdate: string; // ISO "YYYY-MM-DD"
  height: number;
  weight: number;
  avatarUrl: string;
  password: string;
  confirmPassword: string;
}>;

export async function getMe() {
  const { data } = await api.get('/users/me');
  return data;
}

// --- por ID (usado quando temos _id/id no contexto) ---
export async function updateById(userId: string, patch: UpdateMeInput) {
  const { data } = await api.patch(`/users/${userId}`, patch);
  return data;
}

export async function deleteById(userId: string) {
  await api.delete(`/users/${userId}`); // 204
}

// --- /me (fallback quando não temos _id no contexto) ---
export async function updateMe(patch: UpdateMeInput) {
  const { data } = await api.patch('/users/me', patch);
  return data;
}

export async function deleteMe() {
  await api.delete('/users/me'); // 204
}
