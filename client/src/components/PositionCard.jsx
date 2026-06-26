import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPositionAnalysis } from "../api/positionsApi";
import useAuth from "../hooks/useAuth";
import PositionForm from "./PositionForm";
import styles from "./PositionCard.module.css";

function PositionCard({ position, onUpdate, onDelete }) {
  const { token } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    loadPositionAnalysis();
  }, [position.id]);

  async function loadPositionAnalysis() {
    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      const data = await getPositionAnalysis(token, position.id);
      setAnalysis(data);
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleUpdate(positionData) {
    await onUpdate(position.id, positionData);
    setIsEditing(false);
    loadPositionAnalysis();
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete your position for ${position.item_name}?`
    );

    if (confirmed) {
      onDelete(position.id);
    }
  }

  function getProfitLabel(value) {
    if (value > 0) {
      return "Estimated profit after tax";
    }

    if (value < 0) {
      return "Estimated loss after tax";
    }

    return "Estimated break-even after tax";
  }

  if (isEditing) {
    return (
      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Edit {position.item_name}</h3>

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

        <PositionForm
          initialValues={position}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.editButton}
        onClick={() => setIsEditing(true)}
        aria-label={`Edit ${position.item_name}`}
        title="Edit position"
      >
        🛠️
      </button>

      <div className={styles.mainRow}>
        {position.icon_url && (
          <div className={styles.iconWrap}>
            <img
              src={position.icon_url}
              alt={position.item_name}
              width="42"
              height="42"
            />
          </div>
        )}

        <div className={styles.content}>
          <h3>{position.item_name}</h3>

          <div className={styles.metaGrid}>
            <p>
              <span>Quantity</span>
              {position.quantity?.toLocaleString()}
            </p>

            <p>
              <span>Buy price</span>
              {position.buy_price?.toLocaleString()} gp
            </p>
          </div>

          {position.notes && (
            <p className={styles.notes}>Notes: {position.notes}</p>
          )}
        </div>
      </div>

      {analysisLoading && (
        <p className={styles.loadingText}>Checking current value...</p>
      )}

      {analysisError && <p className={styles.errorMessage}>{analysisError}</p>}

      {analysis && (
        <section className={styles.analysisBox}>
          <h4>Estimated if sold now</h4>

          <p>
            <span>Current sell price</span>
            {analysis.raw_sell_price?.toLocaleString()} gp
          </p>

          <p>
            <span>Estimated GE tax</span>
            {analysis.estimated_ge_tax_per_item?.toLocaleString()} gp per item
          </p>

          <p
            className={
              analysis.estimated_profit_after_tax >= 0
                ? styles.positive
                : styles.negative
            }
          >
            <span>{getProfitLabel(analysis.estimated_profit_after_tax)}</span>
            {analysis.estimated_profit_after_tax?.toLocaleString()} gp
          </p>
        </section>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={loadPositionAnalysis}>
          Refresh Value
        </button>

        <Link className={styles.analysisLink} to={`/positions/${position.id}/analysis`}>
          View Analysis
        </Link>

        <button type="button" className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default PositionCard;