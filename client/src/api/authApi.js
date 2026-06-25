import { apiRequest, getAuthHeaders } from "./client";

export function signupUser(userData) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token) {
  return apiRequest("/auth/current-user", {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}