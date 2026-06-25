import PositionCard from "../components/PositionCard";
import PositionForm from "../components/PositionForm";
import usePositions from "../hooks/usePositions";

function PositionsPage() {
  const {
    positions,
    loading,
    error,
    addPosition,
    editPosition,
    removePosition,
  } = usePositions();

  if (loading) {
    return (
      <main className="page">
        <h1>Positions</h1>
        <p>Loading positions...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section>
        <h1>Positions</h1>
        <p>Track items you have bought and compare them against market data.</p>
      </section>

      {error && <p>{error}</p>}

      <section>
        <h2>Add Position</h2>
        <PositionForm onSubmit={addPosition} submitLabel="Add Position" />
      </section>

      <section>
        <h2>Your Positions</h2>

        {positions.length === 0 ? (
          <p>No positions tracked yet.</p>
        ) : (
          positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onUpdate={editPosition}
              onDelete={removePosition}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default PositionsPage;