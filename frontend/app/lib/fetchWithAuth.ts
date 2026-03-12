import { API_URL } from "./api";

function isTokenExpiringSoon(token: string) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000;
  const now = Date.now();

  return exp - now < 60 * 1000; // เหลือ < 1 นาที
}
 
async function refreshToken() {
  const res = await fetch(`${API_URL}/member/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    window.location.href = "/login";
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const accessToken = document.cookie
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  if (accessToken && isTokenExpiringSoon(accessToken)) {
    await refreshToken();
  }

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    await refreshToken();

    res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  }

  return res.json();
}