import { API_BASE_URL } from "./config";

const ACCESS_TOKEN_KEY = "runereport_token";
const REFRESH_TOKEN_KEY = "runereport_refresh_token";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return {
    error: "Server returned an unexpected response.",
  };
}

function isExpiredTokenError(data) {
  const message = data?.error || data?.msg || "";

  return message.toLowerCase().includes("token has expired");
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("No refresh token found.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.error || data.msg || "Session refresh failed.");
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);

  return data.access_token;
}

function clearStoredTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function apiRequest(endpoint, options = {}, retry = true) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (response.ok) {
    return data;
  }

  if (isExpiredTokenError(data) && retry) {
    try {
      const newAccessToken = await refreshAccessToken();

      return apiRequest(
        endpoint,
        {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        },
        false
      );
    } catch {
      clearStoredTokens();
      throw new Error("Your session expired. Please log in again.");
    }
  }

  throw new Error(data.error || data.msg || "Something went wrong.");
}

export function getAuthHeaders(token) {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  return {
    Authorization: `Bearer ${storedToken || token}`,
  };
}