import * as SecureStore from 'expo-secure-store';
import { API_BASE } from '../constants/config';

const TOKEN_KEY = 'auth_token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  if (!text) return { success: false, error: 'Empty response' } as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { success: false, error: 'Invalid JSON' } as T;
  }
}

export const api = {
  get: <T = any>(path: string) => apiRequest<T>(path),

  post: <T = any>(path: string, body?: any) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  upload: <T = any>(path: string, formData: FormData) =>
    apiRequest<T>(path, {
      method: 'POST',
      headers: {},
      body: formData,
    }),
};
