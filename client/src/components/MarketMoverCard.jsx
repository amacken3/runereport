function MarketMoverCard({ mover }) {
  const isPositive = mover.price_change > 0;
  const movementLabel = isPositive ? "Up" : "Down";

  return (
    <article>
      {mover.icon_url && (
        <img
          src={mover.icon_url}
          alt={mover.item_name}
          width="42"
          height="42"
        />
      )}

      <div>
        <h3>{mover.item_name}</h3>

        <p>{mover.current_price?.toLocaleString()} gp</p>

        <p>
          {movementLabel} {Math.abs(mover.percent_change)}% over the last hour
        </p>

        <p>
          {isPositive ? "+" : "-"}
          {Math.abs(mover.price_change)?.toLocaleString()} gp
        </p>
      </div>
    </article>
  );
}

export default MarketMoverCard;