import { API_BASE_URL } from "./config";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.msg || "Something went wrong.");
  }

  return data;
}

export function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}