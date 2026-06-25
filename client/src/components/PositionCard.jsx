import { useEffect, useState } from "react";

import { getPositionAnalysis } from "../api/positionsApi";
import useAuth from "../hooks/useAuth";
import PositionForm from "./PositionForm";

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
      <article>
        <h3>Edit {position.item_name}</h3>

        <PositionForm
          initialValues={position}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />

        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </article>
    );
  }

  return (
    <article>
      {position.icon_url && (
        <img
          src={position.icon_url}
          alt={position.item_name}
          width="42"
          height="42"
        />
      )}

      <h3>{position.item_name}</h3>

      <p>Quantity: {position.quantity?.toLocaleString()}</p>
      <p>Buy price: {position.buy_price?.toLocaleString()} gp</p>

      {position.notes && <p>Notes: {position.notes}</p>}

      {analysisLoading && <p>Checking current value...</p>}

      {analysisError && <p>{analysisError}</p>}

      {analysis && (
        <section>
            <h4>Estimated if sold now</h4>

            <p>
            Current sell price: {analysis.raw_sell_price?.toLocaleString()} gp
            </p>

            <p>
            Estimated GE tax:{" "}
            {analysis.estimated_ge_tax_per_item?.toLocaleString()} gp per item
            </p>

            <p>
            {getProfitLabel(analysis.estimated_profit_after_tax)}:{" "}
            {analysis.estimated_profit_after_tax?.toLocaleString()} gp
            </p>
        </section>
        )}

      <button type="button" onClick={loadPositionAnalysis}>
        Refresh Current Value
      </button>

      <button type="button" onClick={() => setIsEditing(true)}>
        Edit
      </button>

      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </article>
  );
}

export default PositionCard;