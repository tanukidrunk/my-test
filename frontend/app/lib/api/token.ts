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

   // ✅ เช็ค content-type ก่อน parse
  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error(`[apiFetch] Non-JSON response from ${endpoint}:`, text);
    throw new Error(`Server returned non-JSON: ${text.slice(0, 150)}`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};