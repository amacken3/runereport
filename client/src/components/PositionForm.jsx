import { useState } from "react";

import ItemSearchInput from "./ItemSearchInput";
import styles from "./PositionForm.module.css";

const emptyForm = {
  quantity: "",
  buy_price: "",
  notes: "",
};

function PositionForm({ initialValues = {}, onSubmit, submitLabel }) {
  const initialSelectedItem = initialValues.item_id
    ? {
        id: initialValues.item_id,
        name: initialValues.item_name,
      }
    : null;

  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const [formData, setFormData] = useState({
    quantity: initialValues.quantity || "",
    buy_price: initialValues.buy_price || "",
    notes: initialValues.notes || "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedItem) {
      setError("Please select a real OSRS item from the search results.");
      return;
    }

    const positionData = {
      item_id: Number(selectedItem.id),
      item_name: selectedItem.name,
      quantity: Number(formData.quantity),
      buy_price: Number(formData.buy_price),
      notes: formData.notes,
    };

    try {
      await onSubmit(positionData);

      if (!initialValues.id) {
        setSelectedItem(null);
        setFormData(emptyForm);
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
        Quantity
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.field}>
        Buy Price
        <input
          name="buy_price"
          type="number"
          value={formData.buy_price}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.field}>
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className={styles.submitButton}>
        {submitLabel}
      </button>
    </form>
  );
}

export default PositionForm;