import styles from "./MarketMoverCard.module.css";

function MarketMoverCard({ mover }) {
  const isPositive = mover.price_change > 0;
  const movementLabel = isPositive ? "Up" : "Down";

  return (
    <article className={styles.card}>
      {mover.icon_url && (
        <div className={styles.iconWrap}>
          <img
            src={mover.icon_url}
            alt={mover.item_name}
            width="42"
            height="42"
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3>{mover.item_name}</h3>

          <span
            className={isPositive ? styles.positiveBadge : styles.negativeBadge}
          >
            {movementLabel}
          </span>
        </div>

        <p className={styles.price}>{mover.current_price?.toLocaleString()} gp</p>

        <p className={styles.movementText}>
          {movementLabel} {Math.abs(mover.percent_change)}% over the last hour
        </p>

        <p className={isPositive ? styles.positiveChange : styles.negativeChange}>
          {isPositive ? "+" : "-"}
          {Math.abs(mover.price_change)?.toLocaleString()} gp
        </p>
      </div>
    </article>
  );
}

export default MarketMoverCard;