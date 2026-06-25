import { apiRequest } from "./client";

export function getTopMovers() {
  return apiRequest("/market/top-movers");
}

export function getMarketAnalysis(itemId) {
  return apiRequest(`/market/analysis/${itemId}`);
}

export function getMarketTimeseriesAnalysis(itemId, timestep = "24h") {
  return apiRequest(`/market/analysis/${itemId}/timeseries?timestep=${timestep}`);
}

export function getItemMapping() {
  return apiRequest("/market/mapping");
}