import { useEffect, useState } from "react";

import {
  createWatchlistItem,
  deleteWatchlistItem,
  getWatchlistItems,
  updateWatchlistItem,
} from "../api/watchlistApi";
import { createPosition } from "../api/positionsApi";
import { getItemMapping } from "../api/marketApi";
import useAuth from "./useAuth";

function buildIconUrl(icon) {
  if (!icon) {
    return null;
  }

  const formattedIcon = encodeURIComponent(icon.replaceAll(" ", "_"));
  return `https://oldschool.runescape.wiki/images/${formattedIcon}`;
}

function buildItemLookup(mappingData) {
  const itemList = Array.isArray(mappingData)
    ? mappingData
    : Object.values(mappingData);

  return itemList.reduce((lookup, item) => {
    lookup[Number(item.id)] = item;
    return lookup;
  }, {});
}

function addIconsToWatchlistItems(watchlistItems, itemLookup) {
  return watchlistItems.map((item) => {
    const matchingItem = itemLookup[Number(item.item_id)];

    return {
      ...item,
      icon_url: buildIconUrl(matchingItem?.icon),
    };
  });
}

function useWatchlist() {
  const { token } = useAuth();

  const [watchlistItems, setWatchlistItems] = useState([]);
  const [itemLookup, setItemLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWatchlist() {
    try {
      const [watchlistData, mappingData] = await Promise.all([
        getWatchlistItems(token),
        getItemMapping(),
      ]);

      const lookup = buildItemLookup(mappingData);

      setItemLookup(lookup);
      setWatchlistItems(addIconsToWatchlistItems(watchlistData, lookup));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function addWatchlistItem(watchlistData) {
    const newItem = await createWatchlistItem(token, watchlistData);
    const itemWithIcon = addIconsToWatchlistItems([newItem], itemLookup)[0];

    setWatchlistItems([...watchlistItems, itemWithIcon]);
    return itemWithIcon;
  }

  async function editWatchlistItem(watchlistItemId, watchlistData) {
    const updatedItem = await updateWatchlistItem(
      token,
      watchlistItemId,
      watchlistData
    );
    const itemWithIcon = addIconsToWatchlistItems([updatedItem], itemLookup)[0];

    setWatchlistItems(
      watchlistItems.map((item) =>
        item.id === itemWithIcon.id ? itemWithIcon : item
      )
    );

    return itemWithIcon;
  }

  async function removeWatchlistItem(watchlistItemId) {
    await deleteWatchlistItem(token, watchlistItemId);

    setWatchlistItems(
      watchlistItems.filter((item) => item.id !== watchlistItemId)
    );
  }

  async function moveWatchlistItemToPositions(watchlistItem, positionData) {
    const newPosition = await createPosition(token, {
      item_id: watchlistItem.item_id,
      item_name: watchlistItem.item_name,
      quantity: Number(positionData.quantity),
      buy_price: Number(positionData.buy_price),
      notes: positionData.notes,
    });

    return newPosition;
  }

  return {
    watchlistItems,
    loading,
    error,
    addWatchlistItem,
    editWatchlistItem,
    removeWatchlistItem,
    moveWatchlistItemToPositions,
  };
}

export default useWatchlist;