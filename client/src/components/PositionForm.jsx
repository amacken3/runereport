import { useState } from "react";

import ItemSearchInput from "./ItemSearchInput";

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
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <ItemSearchInput selectedItem={selectedItem} onSelect={setSelectedItem} />

      <label>
        Quantity
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Buy Price
        <input
          name="buy_price"
          type="number"
          value={formData.buy_price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </label>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default PositionForm;