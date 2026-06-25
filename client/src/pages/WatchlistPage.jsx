import WatchlistCard from "../components/WatchlistCard";
import WatchlistForm from "../components/WatchlistForm";
import useWatchlist from "../hooks/useWatchlist";

function WatchlistPage() {
  const {
    watchlistItems,
    loading,
    error,
    addWatchlistItem,
    editWatchlistItem,
    removeWatchlistItem,
    moveWatchlistItemToPositions,
  } = useWatchlist();

  if (loading) {
    return (
      <main className="page">
        <h1>Watchlist</h1>
        <p>Loading watchlist...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section>
        <h1>Watchlist</h1>
        <p>
          Save items you want to monitor before adding them to your active
          positions.
        </p>
      </section>

      {error && <p>{error}</p>}

      <section>
        <h2>Add Watchlist Item</h2>
        <WatchlistForm
          onSubmit={addWatchlistItem}
          submitLabel="Add to Watchlist"
        />
      </section>

      <section>
        <h2>Your Watchlist</h2>

        {watchlistItems.length === 0 ? (
          <p>No watchlist items yet.</p>
        ) : (
          watchlistItems.map((watchlistItem) => (
            <WatchlistCard
              key={watchlistItem.id}
              watchlistItem={watchlistItem}
              onUpdate={editWatchlistItem}
              onDelete={removeWatchlistItem}
              onAddToPositions={moveWatchlistItemToPositions}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default WatchlistPage;