import { apiRequest, getAuthHeaders } from "./client";

export function getPositions(token) {
  return apiRequest("/positions", {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}

export function createPosition(token, positionData) {
  return apiRequest("/positions", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(positionData),
  });
}

export function updatePosition(token, positionId, positionData) {
  return apiRequest(`/positions/${positionId}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(positionData),
  });
}

export function deletePosition(token, positionId) {
  return apiRequest(`/positions/${positionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}

export function getPositionAnalysis(token, positionId) {
  return apiRequest(`/positions/${positionId}/analysis`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}

export function generatePositionAiAnalysis(token, positionId) {
  return apiRequest(`/positions/${positionId}/ai-analysis`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
}