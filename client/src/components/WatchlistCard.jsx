import { useEffect, useState } from "react";

import { getMarketAnalysis } from "../api/marketApi";
import WatchlistForm from "./WatchlistForm";
import styles from "./WatchlistCard.module.css";

function WatchlistCard({
  watchlistItem,
  onUpdate,
  onDelete,
  onAddToPositions,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingToPositions, setIsAddingToPositions] = useState(false);
  const [positionFormData, setPositionFormData] = useState({
    quantity: "",
    buy_price: "",
    notes: "",
  });
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMarketAnalysis() {
      setMarketLoading(true);
      setMarketError("");

      try {
        const data = await getMarketAnalysis(watchlistItem.item_id);
        setMarketAnalysis(data);
      } catch (err) {
        setMarketError(err.message);
      } finally {
        setMarketLoading(false);
      }
    }

    loadMarketAnalysis();
  }, [watchlistItem.item_id]);

  async function handleUpdate(watchlistData) {
    await onUpdate(watchlistItem.id, watchlistData);
    setIsEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${watchlistItem.item_name} from your watchlist?`
    );

    if (confirmed) {
      onDelete(watchlistItem.id);
    }
  }

  function handlePositionChange(event) {
    setPositionFormData({
      ...positionFormData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleAddToPositions(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await onAddToPositions(watchlistItem, positionFormData);

      setMessage("Added to positions.");
      setIsAddingToPositions(false);
      setPositionFormData({
        quantity: "",
        buy_price: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  function getMovementText() {
    if (!marketAnalysis) {
      return null;
    }

    const percentChange = marketAnalysis.one_hour_percent_change;

    if (percentChange === undefined || percentChange === null) {
      return null;
    }

    if (percentChange > 0) {
      return `Up ${Math.abs(percentChange)}% over the last hour`;
    }

    if (percentChange < 0) {
      return `Down ${Math.abs(percentChange)}% over the last hour`;
    }

    return "No movement over the last hour";
  }

  function getMovementClass() {
    if (!marketAnalysis) {
      return styles.movementText;
    }

    const percentChange = marketAnalysis.one_hour_percent_change;

    if (percentChange > 0) {
      return styles.positive;
    }

    if (percentChange < 0) {
      return styles.negative;
    }

    return styles.movementText;
  }

  if (isEditing) {
    return (
      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Edit {watchlistItem.item_name}</h3>

          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setIsEditing(false)}
            aria-label="Cancel editing"
            title="Cancel editing"
          >
            ✕
          </button>
        </div>

        <WatchlistForm
          initialValues={watchlistItem}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.topActions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setIsAddingToPositions(true)}
          aria-label={`Add ${watchlistItem.item_name} to positions`}
          title="Add to positions"
        >
          +
        </button>

        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setIsEditing(true)}
          aria-label={`Edit ${watchlistItem.item_name}`}
          title="Edit watchlist item"
        >
          🛠️
        </button>
      </div>

      <div className={styles.mainRow}>
        {watchlistItem.icon_url && (
          <div className={styles.iconWrap}>
            <img
              src={watchlistItem.icon_url}
              alt={watchlistItem.item_name}
              width="42"
              height="42"
            />
          </div>
        )}

        <div className={styles.content}>
          <h3>{watchlistItem.item_name}</h3>

          {marketLoading && (
            <p className={styles.loadingText}>Loading market data...</p>
          )}

          {marketError && <p className={styles.errorMessage}>{marketError}</p>}

          {marketAnalysis && (
            <div className={styles.marketGrid}>
              <p>
                <span>Current price</span>
                {marketAnalysis.current_price?.toLocaleString()} gp
              </p>

              {getMovementText() && (
                <p className={getMovementClass()}>
                  <span>Movement</span>
                  {getMovementText()}
                </p>
              )}
            </div>
          )}

          {watchlistItem.notes && (
            <p className={styles.notes}>Notes: {watchlistItem.notes}</p>
          )}

          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>

      {isAddingToPositions && (
        <form className={styles.positionForm} onSubmit={handleAddToPositions}>
          <h4>Add {watchlistItem.item_name} to Positions</h4>

          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              value={positionFormData.quantity}
              onChange={handlePositionChange}
              required
            />
          </label>

          <label>
            Buy Price
            <input
              name="buy_price"
              type="number"
              value={positionFormData.buy_price}
              onChange={handlePositionChange}
              required
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={positionFormData.notes}
              onChange={handlePositionChange}
            />
          </label>

          <div className={styles.formActions}>
            <button type="submit">Save Position</button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsAddingToPositions(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.bottomActions}>
        <button type="button" className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default WatchlistCard;