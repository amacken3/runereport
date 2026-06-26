import { useState } from "react";

import WatchlistCard from "../components/WatchlistCard";
import WatchlistForm from "../components/WatchlistForm";
import useWatchlist from "../hooks/useWatchlist";
import styles from "./WatchlistPage.module.css";

function WatchlistPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    watchlistItems,
    loading,
    error,
    addWatchlistItem,
    editWatchlistItem,
    removeWatchlistItem,
    moveWatchlistItemToPositions,
  } = useWatchlist();

  async function handleAddWatchlistItem(watchlistData) {
    await addWatchlistItem(watchlistData);
    setShowAddForm(false);
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Watchlist</h1>
          <p>Loading watchlist...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Items you are watching</p>
        <h1>Watchlist</h1>
        <p>
          Save items you want to monitor before adding them to your active
          positions.
        </p>
      </section>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <section className={styles.addSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Add Watchlist Item</h2>
            <p>Track an item without recording a buy price yet.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "+ Add Watchlist Item"}
          </button>
        </div>

        {showAddForm && (
          <div className={styles.formWrap}>
            <WatchlistForm
              onSubmit={handleAddWatchlistItem}
              submitLabel="Add to Watchlist"
            />
          </div>
        )}
      </section>

      <section className={styles.watchlistSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Your Watchlist</h2>
            <p>Monitor current prices before committing to a position.</p>
          </div>
        </div>

        {watchlistItems.length === 0 ? (
          <p className={styles.emptyText}>No watchlist items yet.</p>
        ) : (
          <div className={styles.cardGrid}>
            {watchlistItems.map((watchlistItem) => (
              <WatchlistCard
                key={watchlistItem.id}
                watchlistItem={watchlistItem}
                onUpdate={editWatchlistItem}
                onDelete={removeWatchlistItem}
                onAddToPositions={moveWatchlistItemToPositions}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default WatchlistPage;