import { useState } from "react";

import PositionCard from "../components/PositionCard";
import PositionForm from "../components/PositionForm";
import usePositions from "../hooks/usePositions";
import styles from "./PositionsPage.module.css";

function PositionsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    positions,
    loading,
    error,
    addPosition,
    editPosition,
    removePosition,
  } = usePositions();

  async function handleAddPosition(positionData) {
    await addPosition(positionData);
    setShowAddForm(false);
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Positions</h1>
          <p>Loading positions...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Your Grand Exchange holdings</p>
        <h1>Positions</h1>
        <p>
          Track items you have bought and compare them against current market
          data, GE tax, and estimated profit or loss.
        </p>
      </section>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <section className={styles.addSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Add Position</h2>
            <p>Add an item you bought so RuneReport can track its value.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "+ Add Position"}
          </button>
        </div>

        {showAddForm && (
          <div className={styles.formWrap}>
            <PositionForm
              onSubmit={handleAddPosition}
              submitLabel="Add Position"
            />
          </div>
        )}
      </section>

      <section className={styles.positionsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Your Positions</h2>
            <p>Saved items with live value checks and analysis links.</p>
          </div>
        </div>

        {positions.length === 0 ? (
          <p className={styles.emptyText}>No positions tracked yet.</p>
        ) : (
          <div className={styles.cardGrid}>
            {positions.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
                onUpdate={editPosition}
                onDelete={removePosition}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PositionsPage;