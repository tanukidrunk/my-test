import { getToken } from "./token";

export const fetchjwtAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};