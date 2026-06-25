import { useEffect, useState } from "react";

import MarketMoverCard from "../components/MarketMoverCard";
import useMarketMovers from "../hooks/useMarketMovers";

function getLastUpdatedText(lastUpdated, now) {
  if (!lastUpdated) {
    return "Not updated yet";
  }

  const diffInMs = now - lastUpdated.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) {
    return "Updated just now";
  }

  if (diffInMinutes === 1) {
    return "Updated 1 minute ago";
  }

  return `Updated ${diffInMinutes} minutes ago`;
}

function DashboardPage() {
  const { topMovers, loading, error, lastUpdated } = useMarketMovers();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <main className="page">
        <h1>Dashboard</h1>
        <p>Loading market movers...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>Dashboard</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section>
        <h1>Market Dashboard</h1>
        <p>
          Items with the largest price movement compared to recent hourly market
          data.
        </p>
        <p>{getLastUpdatedText(lastUpdated, now)}</p>
      </section>

      <section>
        <h2>Top Gainers</h2>

        {topMovers.top_gainers.length === 0 ? (
          <p>No top gainers found.</p>
        ) : (
          topMovers.top_gainers.map((mover) => (
            <MarketMoverCard key={mover.item_id} mover={mover} />
          ))
        )}
      </section>

      <section>
        <h2>Top Losers</h2>

        {topMovers.top_losers.length === 0 ? (
          <p>No top losers found.</p>
        ) : (
          topMovers.top_losers.map((mover) => (
            <MarketMoverCard key={mover.item_id} mover={mover} />
          ))
        )}
      </section>
    </main>
  );
}

export default DashboardPage;