import { useEffect, useState } from "react";

import { getItemMapping } from "../api/marketApi";
import {
  createPosition,
  deletePosition,
  getPositions,
  updatePosition,
} from "../api/positionsApi";
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

function addIconsToPositions(positions, itemLookup) {
  return positions.map((position) => {
    const matchingItem = itemLookup[Number(position.item_id)];

    return {
      ...position,
      icon_url: buildIconUrl(matchingItem?.icon),
    };
  });
}

function usePositions() {
  const { token } = useAuth();

  const [positions, setPositions] = useState([]);
  const [itemLookup, setItemLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPositions() {
    try {
      const [positionsData, mappingData] = await Promise.all([
        getPositions(token),
        getItemMapping(),
      ]);

      const lookup = buildItemLookup(mappingData);

      setItemLookup(lookup);
      setPositions(addIconsToPositions(positionsData, lookup));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPositions();
  }, []);

  async function addPosition(positionData) {
    const newPosition = await createPosition(token, positionData);
    const positionWithIcon = addIconsToPositions([newPosition], itemLookup)[0];

    setPositions([...positions, positionWithIcon]);
    return positionWithIcon;
  }

  async function editPosition(positionId, positionData) {
    const updatedPosition = await updatePosition(token, positionId, positionData);
    const positionWithIcon = addIconsToPositions(
      [updatedPosition],
      itemLookup
    )[0];

    setPositions(
      positions.map((position) =>
        position.id === positionWithIcon.id ? positionWithIcon : position
      )
    );

    return positionWithIcon;
  }

  async function removePosition(positionId) {
    await deletePosition(token, positionId);

    setPositions(positions.filter((position) => position.id !== positionId));
  }

  return {
    positions,
    loading,
    error,
    addPosition,
    editPosition,
    removePosition,
  };
}

export default usePositions;