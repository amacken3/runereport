import { useEffect, useState } from "react";

import { getTopMovers } from "../api/marketApi";

const REFRESH_INTERVAL_MS = 300000;

function useMarketMovers() {
  const [topMovers, setTopMovers] = useState({
    top_gainers: [],
    top_losers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTopMovers(showLoading = false) {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getTopMovers();

        if (isMounted) {
          setTopMovers(data);
          setLastUpdated(new Date());
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTopMovers(true);

    const intervalId = setInterval(() => {
      loadTopMovers(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return {
    topMovers,
    loading,
    error,
    lastUpdated,
  };
}

export default useMarketMovers;