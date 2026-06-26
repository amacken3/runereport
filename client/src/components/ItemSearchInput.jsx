import { useEffect, useMemo, useState } from "react";

import { getItemMapping } from "../api/marketApi";
import styles from "./ItemSearchInput.module.css";

function buildIconUrl(item) {
  const icon = item?.icon;

  if (!icon) {
    return null;
  }

  const formattedIcon = encodeURIComponent(icon.replaceAll(" ", "_"));
  return `https://oldschool.runescape.wiki/images/${formattedIcon}`;
}

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
    <div className={styles.searchWrap}>
      <label className={styles.field}>
        Item Name
        <input
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for an OSRS item"
          required
        />
      </label>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {matchingItems.length > 0 && !selectedItem && (
        <ul className={styles.resultsList}>
          {matchingItems.map((item) => {
            const iconUrl = buildIconUrl(item);

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.resultButton}
                  onClick={() => handleSelect(item)}
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      width="32"
                      height="32"
                      className={styles.itemIcon}
                    />
                  ) : (
                    <span className={styles.iconFallback}>◆</span>
                  )}

                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedItem && (
        <div className={styles.selectedItem}>
          {buildIconUrl(selectedItem) ? (
            <img
              src={buildIconUrl(selectedItem)}
              alt=""
              width="32"
              height="32"
              className={styles.itemIcon}
            />
          ) : (
            <span className={styles.iconFallback}>◆</span>
          )}

          <p>
            <span>Selected item</span>
            {selectedItem.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default ItemSearchInput;