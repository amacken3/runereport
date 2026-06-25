import { apiRequest, getAuthHeaders } from "./client";

export function getWatchlistItems(token) {
  return apiRequest("/watchlist", {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}

export function createWatchlistItem(token, watchlistItemData) {
  return apiRequest("/watchlist", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(watchlistItemData),
  });
}

export function updateWatchlistItem(token, watchlistItemId, watchlistItemData) {
  return apiRequest(`/watchlist/${watchlistItemId}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(watchlistItemData),
  });
}

export function deleteWatchlistItem(token, watchlistItemId) {
  return apiRequest(`/watchlist/${watchlistItemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}