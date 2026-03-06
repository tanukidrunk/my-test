export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // ถ้า token หมดอายุ
  if (res.status === 401) {
    const refresh = await fetch(
      `${process.env.NEXT_PUBLIC_API}/member/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refresh.ok) {
      // retry request
      res = await fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      window.location.href = "/login";
    }
  }

  return res;
}