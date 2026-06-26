import { useEffect, useState } from "react";

import MarketMoverCard from "../components/MarketMoverCard";
import useMarketMovers from "../hooks/useMarketMovers";
import styles from "./DashboardPage.module.css";

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
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Dashboard</h1>
          <p>Loading market movers...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Dashboard</h1>
          <p className={styles.errorMessage}>{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Live Grand Exchange movement</p>

        <h1>Market Dashboard</h1>

        <p className={styles.description}>
          Items with the largest price movement compared to recent hourly market
          data.
        </p>

        <p className={styles.updatedText}>
          {getLastUpdatedText(lastUpdated, now)}
        </p>
      </section>

      <div className={styles.moverGrid}>
        <section className={styles.moverSection}>
          <div className={styles.sectionHeader}>
            <h2>Top Gainers</h2>
            <span className={styles.gainerBadge}>Rising</span>
          </div>

          <div className={styles.cardList}>
            {topMovers.top_gainers.length === 0 ? (
              <p className={styles.emptyText}>No top gainers found.</p>
            ) : (
              topMovers.top_gainers.map((mover) => (
                <MarketMoverCard key={mover.item_id} mover={mover} />
              ))
            )}
          </div>
        </section>

        <section className={styles.moverSection}>
          <div className={styles.sectionHeader}>
            <h2>Top Losers</h2>
            <span className={styles.loserBadge}>Falling</span>
          </div>

          <div className={styles.cardList}>
            {topMovers.top_losers.length === 0 ? (
              <p className={styles.emptyText}>No top losers found.</p>
            ) : (
              topMovers.top_losers.map((mover) => (
                <MarketMoverCard key={mover.item_id} mover={mover} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;