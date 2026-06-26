import { useState } from "react";

import ItemSearchInput from "./ItemSearchInput";
import styles from "./WatchlistForm.module.css";

function WatchlistForm({ initialValues = {}, onSubmit, submitLabel }) {
  const initialSelectedItem = initialValues.item_id
    ? {
        id: initialValues.item_id,
        name: initialValues.item_name,
      }
    : null;

  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const [notes, setNotes] = useState(initialValues.notes || "");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedItem) {
      setError("Please select a real OSRS item from the search results.");
      return;
    }

    try {
      await onSubmit({
        item_id: Number(selectedItem.id),
        item_name: selectedItem.name,
        notes,
      });

      if (!initialValues.id) {
        setSelectedItem(null);
        setNotes("");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.field}>
        <ItemSearchInput selectedItem={selectedItem} onSelect={setSelectedItem} />
      </div>

      <label className={styles.field}>
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>

      <button type="submit" className={styles.submitButton}>
        {submitLabel}
      </button>
    </form>
  );
}

export default WatchlistForm;