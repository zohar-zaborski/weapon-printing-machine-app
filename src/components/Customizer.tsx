import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { weaponsAtom, partsAtom } from "../atoms/customizationAtoms";
import {
  getCustomizations,
  createCustomization,
} from "../services/customization.service";
import { getParts } from "../services/parts.service";
import { Weapon, Part, Customization } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWeapons } from "../services/weapons.service";
import AppNavbar from "./AppNavbar";

const Customizer: React.FC = () => {
  const [, setWeapons] = useAtom(weaponsAtom); // Setter for weapons atom
  const [, setParts] = useAtom(partsAtom); // Setter for parts atom
  const [weapons, setLocalWeapons] = useState<Weapon[]>([]); // Local weapons state
  const [parts, setLocalParts] = useState<Part[]>([]); // Local parts state
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null); // Selected weapon ID
  const [selectedParts, setSelectedParts] = useState<number[]>([]); // Selected part IDs
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    const fetchWeaponsAndParts = async () => {
      try {
        const fetchedWeapons = await getWeapons();
        const fetchedParts = await getParts();

        setWeapons(fetchedWeapons);
        setParts(fetchedParts);
        setLocalWeapons(fetchedWeapons);
        setLocalParts(fetchedParts);
      } catch (error) {
        setMessage("Failed to fetch weapons or parts.");
      }
    };

    fetchWeaponsAndParts();
  }, [setWeapons, setParts]);

  const handleWeaponChange = (weaponId: number) => {
    setSelectedWeapon(weaponId);
    setSelectedParts([]); // Reset selected parts when a new weapon is selected
  };

  const handlePartChange = (partId: number, isSelected: boolean) => {
    setSelectedParts((prev) =>
      isSelected ? [...prev, partId] : prev.filter((id) => id !== partId)
    );
  };

  const handleCreateCustomization = async () => {
    if (loading) return; // Prevent multiple calls if already processing
    if (!selectedWeapon || selectedParts.length === 0) {
      setMessage("Please select a weapon and at least one part.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        weapon_id: selectedWeapon,
        parts: selectedParts,
      };

      const newCustomization = await createCustomization(payload);

      setMessage(`Customization created with ID: ${newCustomization.id}`);
    } catch (error) {
      console.error("Failed to create customization:", error);
      setMessage("Failed to create customization.");
    } finally {
      setLoading(false); // Reset loading state
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

  return (
    <div>
      <AppNavbar />
      <div className="container mt-5">
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Customize Your Weapon</h3>

                {/* Weapon Dropdown */}
                <div className="mb-4">
                  <h5>Select Weapon</h5>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      const weaponId = Number(e.target.value);
                      if (!isNaN(weaponId)) {
                        handleWeaponChange(weaponId);
                      } else {
                        console.error(
                          "Invalid weapon ID selected:",
                          e.target.value
                        );
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
                <div>
                  <h5>Select Parts</h5>
                  {filteredParts.length === 0 ? (
                    <p>
                      No compatible parts available for the selected weapon.
                    </p>
                  ) : (
                    filteredParts.map((part) => (
                      <div key={part.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={part.id}
                          id={`part-${part.id}`}
                          onChange={(e) =>
                            handlePartChange(
                              Number(e.target.value),
                              e.target.checked
                            )
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
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={handleCreateCustomization}
              disabled={loading} // Disable while loading
            >
              {loading ? "Saving..." : "Save Customization"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
