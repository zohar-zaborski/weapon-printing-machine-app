import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { weaponsAtom, partsAtom } from "../atoms/customizationAtoms";
import {
  getCustomizations,
  createCustomization,
} from "../services/customization.service";
import { getParts } from "../services/parts.service";
import authService from "../services/auth.service";
import { Weapon, Part, Customization } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWeapons } from "../services/weapons.service";
import { Navbar } from "react-bootstrap";
import AppNavbar from "./AppNavbar";

const Customizer: React.FC = () => {
  const [, setWeapons] = useAtom(weaponsAtom); // Setter for weapons atom
  const [, setParts] = useAtom(partsAtom); // Setter for parts atom
  const [weapons, setLocalWeapons] = useState<Weapon[]>([]); // Local weapons state
  const [parts, setLocalParts] = useState<Part[]>([]); // Local parts state
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null); // Selected weapon ID
  const [selectedParts, setSelectedParts] = useState<number[]>([]); // Selected part IDs
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeaponsAndParts = async () => {
      try {
        const fetchedWeapons = await getWeapons();
        console.log("Fetched Weapons:", fetchedWeapons);

        const fetchedParts = await getParts();
        console.log("Fetched Parts:", fetchedParts);

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

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const data = await getCustomizations();
        console.log("Fetched Customizations:", data);
        setCustomizations(data);
      } catch (error) {
        console.error("Failed to fetch customizations:", error);
      }
    };

    fetchCustomizations();
  }, []);

  const handleWeaponChange = (weaponId: number) => {
    console.log("Weapon selected from dropdown:", weaponId);
    setSelectedWeapon(weaponId);
    setSelectedParts([]); // Reset selected parts when a new weapon is selected
  };

  const handlePartChange = (partId: number, isSelected: boolean) => {
    console.log(
      `Part ${partId} selection changed. Is selected: ${isSelected}`
    );
    setSelectedParts((prev) =>
      isSelected ? [...prev, partId] : prev.filter((id) => id !== partId)
    );
  };

  const handleCreateCustomization = async () => {
    if (!selectedWeapon || selectedParts.length === 0) {
      console.log("Validation failed: No weapon or parts selected.");
      setMessage("Please select a weapon and at least one part.");
      return;
    }

    try {
      // Prepare payload in the specified format
      const payload = {
        weapon_id: selectedWeapon,
        parts: selectedParts,
      };

      console.log("Payload being sent to the backend:", payload);

      // Call the API with the payload
      const newCustomization = await createCustomization(payload);
      console.log("Response from the backend:", newCustomization);

      setMessage(`Customization created with ID: ${newCustomization.id}`);
      setCustomizations((prev) => [...prev, newCustomization]); // Add to saved customizations
    } catch (error) {
      console.error("Failed to create customization:", error);
      setMessage("Failed to create customization.");
    }
  };

  // Filter parts based on the selected weapon
  const filteredParts = selectedWeapon
    ? parts.filter((part) =>
        part.compatible_weapons.includes(
          weapons.find((weapon) => weapon.id === selectedWeapon)?.name || ""
        )
      )
    : parts;

  console.log("Filtered parts for selected weapon:", filteredParts);
  console.log("Selected Weapon ID:", selectedWeapon);
  console.log("Selected Parts IDs:", selectedParts);

  return (
    <div>
      <AppNavbar />

      {/* Main Content */}
      <div className="container mt-5">
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {/* Weapon Dropdown */}
          <div className="col-md-6 mb-4">
  <h3>Select Weapon</h3>
  <select
    className="form-select"
    onChange={(e) => {
      const weaponId = Number(e.target.value); // Use Number for clarity
      console.log("Dropdown change event. Raw value:", e.target.value); // Log raw value
      console.log("Parsed Weapon ID:", weaponId); // Log parsed ID
      if (!isNaN(weaponId)) {
        handleWeaponChange(weaponId); // Call handler with parsed ID
      } else {
        console.error("Invalid weapon ID selected:", e.target.value);
      }
    }}
    value={selectedWeapon || ""}
  >
    <option value="" disabled>
      Select a weapon
    </option>
    {weapons.map((weapon) => (
      <option key={weapon.id} value={weapon.id}>
        {weapon.name}
      </option>
    ))}
  </select>
</div>


          {/* Parts Selection */}
          <div className="col-md-6 mb-4">
            <h3>Select Parts</h3>
            {filteredParts.length === 0 ? (
              <p>No compatible parts available for the selected weapon.</p>
            ) : (
              filteredParts.map((part) => (
                <div key={part.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={part.id}
                    id={`part-${part.id}`}
                    onChange={(e) =>
                      handlePartChange(Number(e.target.value), e.target.checked)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`part-${part.id}`}
                  >
                    {part.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={handleCreateCustomization}
            >
              Save Customization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
