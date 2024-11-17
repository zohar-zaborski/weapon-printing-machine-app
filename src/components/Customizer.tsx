import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { weaponsAtom, partsAtom } from "../atoms/customizationAtoms";
import {
  getCustomizations,
  createCustomization,
} from "../services/customization.service";

import { getParts } from "../services/parts.service";
import authService from "../services/auth.service";
import { Weapon, Part, Customization } from "../types";

const Customizer: React.FC = () => {
  const [, setWeapons] = useAtom(weaponsAtom); // Setter for weapons atom
  const [, setParts] = useAtom(partsAtom); // Setter for parts atom
  const [weapons, setLocalWeapons] = useState<Weapon[]>([]); // Local weapons state
  const [parts, setLocalParts] = useState<Part[]>([]); // Local parts state
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null); // Selected weapon ID
  const [selectedParts, setSelectedParts] = useState<number[]>([]); // Selected part IDs
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch weapons and parts on component mount
  useEffect(() => {
    const fetchWeaponsAndParts = async () => {
      try {
        const fetchedWeapons = await authService.getWeapons();
        const fetchedParts = await getParts();
        setWeapons(fetchedWeapons); // Update global state
        setParts(fetchedParts); // Update global state
        setLocalWeapons(fetchedWeapons); // Update local state
        setLocalParts(fetchedParts); // Update local state
      } catch (error) {
        console.error("Failed to fetch weapons or parts:", error);
        setMessage("Failed to fetch weapons or parts.");
      }
    };

    fetchWeaponsAndParts();
  }, [setWeapons, setParts]);

  // Fetch saved customizations on component mount
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const data = await getCustomizations();
        setCustomizations(data);
      } catch (error) {
        console.error("Failed to fetch customizations:", error);
      }
    };

    fetchCustomizations();
  }, []);

  // Handle weapon selection
  const handleWeaponChange = (weaponId: number) => {
    console.log("Selected Weapon ID:", weaponId); // Debugging
    setSelectedWeapon(weaponId); // Update state
  };

  // Handle part selection
  const handlePartChange = (partId: number, isSelected: boolean) => {
    setSelectedParts((prev) =>
      isSelected ? [...prev, partId] : prev.filter((id) => id !== partId)
    );
    console.log('Selected Parts:', selectedParts);
  };

  // Handle customization creation
  const handleCreateCustomization = async () => {
    if (!selectedWeapon || selectedParts.length === 0) {
      setMessage("Please select a weapon and at least one part.");
      return;
    }

    try {
      const newCustomization = await createCustomization(
        selectedWeapon,
        selectedParts
      );
      setMessage(`Customization created with ID: ${newCustomization.id}`);
      setCustomizations((prev) => [...prev, newCustomization]); // Add to saved customizations
    } catch (error) {
      console.error("Failed to create customization:", error);
      setMessage("Failed to create customization.");
    }
  };

  return (
    <div>
      <h2>Customize Your Weapon</h2>
      {message && <p>{message}</p>}

      {/* Weapon Dropdown */}
      <div>
        <h3>Select Weapon</h3>
        <select
          onChange={(e) => {
            const value = e.target.value;
            console.log("Selected value from dropdown:", value); // Debugging the raw value
            const weaponId = parseInt(value, 10); // Convert the value to an integer
            if (!isNaN(weaponId)) {
              handleWeaponChange(weaponId);
            } else {
              console.error("Invalid weapon ID selected:", value);
            }
          }}
          value={selectedWeapon || ""}
        >
          <option value="" disabled>
            Select a weapon
          </option>
          {weapons.map((weapon) => (
            <option key={weapon.id} value={weapon.id}>
              {weapon.name} {/* Weapon name is displayed, but ID is passed */}
            </option>
          ))}
        </select>
      </div>

      {/* Parts Dropdown */}
      <div>
        <h3>Select Parts</h3>
        {parts.length === 0 ? (
          <p>No parts available.</p>
        ) : (
          parts.map((part) => (
            <div key={part.id}>
              <label>
                <input
                  type="checkbox"
                  value={part.id}
                  onChange={(e) =>
                    handlePartChange(Number(e.target.value), e.target.checked)
                  }
                />
                {part.name}
              </label>
            </div>
          ))
        )}
      </div>

      <button onClick={handleCreateCustomization}>Save Customization</button>

      {/* Display Saved Customizations */}
      <h3>Saved Customizations</h3>
      {customizations.length === 0 ? (
        <p>No customizations available.</p>
      ) : (
        <ul>
          {customizations.map((customization, index) => (
            <li key={index}>
              <p>Weapon ID: {customization.weaponId}</p>
              <p>Parts: {customization.parts.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Customizer;
