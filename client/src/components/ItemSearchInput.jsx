import { useEffect, useMemo, useState } from "react";

import { getItemMapping } from "../api/marketApi";

function ItemSearchInput({ selectedItem, onSelect }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(selectedItem?.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getItemMapping();
        const itemList = Array.isArray(data) ? data : Object.values(data);
        setItems(itemList);
      } catch (err) {
        setError(err.message);
      }
    }

    loadItems();
  }, []);

  const matchingItems = useMemo(() => {
    if (searchTerm.trim().length < 2) {
      return [];
    }

    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8);
  }, [items, searchTerm]);

  function handleChange(event) {
    setSearchTerm(event.target.value);
    onSelect(null);
  }

  function handleSelect(item) {
    setSearchTerm(item.name);
    onSelect(item);
  }

  return (
    <div>
      <label>
        Item Name
        <input
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for an OSRS item"
          required
        />
      </label>

      {error && <p>{error}</p>}

      {matchingItems.length > 0 && !selectedItem && (
        <ul>
          {matchingItems.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => handleSelect(item)}>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedItem && <p>Selected item: {selectedItem.name}</p>}
    </div>
  );
}

export default ItemSearchInput;