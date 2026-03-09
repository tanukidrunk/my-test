export const API_URL = process.env.NEXT_PUBLIC_API;

const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  } 
  return null;
};

export const removeToken = () => { 
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}; 
 
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // ใส่ Content-Type เฉพาะ JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};