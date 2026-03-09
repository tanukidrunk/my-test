import { API_URL } from "./api";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  // ถ้า accessToken หมด
  if (res.status === 401) {

    const refresh = await fetch(`${API_URL}/member/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {

      // retry request เดิม
      res = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
      });

    } else {

      // refresh ไม่สำเร็จ → logout
      window.location.href = "/login";

    }
  }

  return res;
}