import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { weaponsAtom, partsAtom } from '../atoms/customizationAtoms';
import { getCustomizations, createCustomization } from '../services/customization.service';
import { Weapon, Part, Customization } from '../types';

const Customizer: React.FC = () => {
  const [weapons] = useAtom(weaponsAtom); // Fetch weapons from the atom
  const [parts] = useAtom(partsAtom); // Fetch parts from the atom
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null); // Selected weapon ID
  const [selectedParts, setSelectedParts] = useState<number[]>([]); // Selected part IDs
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch saved customizations on component mount
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const data = await getCustomizations();
        setCustomizations(data);
      } catch (error) {
        console.error('Failed to fetch customizations:', error);
      }
    };

    fetchCustomizations();
  }, []);

  // Handle weapon selection
  const handleWeaponChange = (weaponId: number) => {
    setSelectedWeapon(weaponId);
  };

  // Handle part selection
  const handlePartChange = (partId: number, isSelected: boolean) => {
    setSelectedParts((prev) =>
      isSelected ? [...prev, partId] : prev.filter((id) => id !== partId)
    );
  };

  // Handle customization creation
  const handleCreateCustomization = async () => {
    if (!selectedWeapon || selectedParts.length === 0) {
      setMessage('Please select a weapon and at least one part.');
      return;
    }

    try {
      const newCustomization = await createCustomization(selectedWeapon, selectedParts);
      setMessage(`Customization created with ID: ${newCustomization.id}`);
      setCustomizations((prev) => [...prev, newCustomization]); // Add to saved customizations
    } catch (error) {
      console.error('Failed to create customization:', error);
      setMessage('Failed to create customization.');
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
          onChange={(e) => handleWeaponChange(Number(e.target.value))}
          value={selectedWeapon || ''}
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

      {/* Parts Dropdown */}
      <div>
        <h3>Select Parts</h3>
        {parts.map((part) => (
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
        ))}
      </div>

      <button onClick={handleCreateCustomization}>Save Customization</button>

      {/* Display Saved Customizations */}
      <h3>Saved Customizations</h3>
      <ul>
        {customizations.map((customization, index) => (
          <li key={index}>
            <p>Weapon ID: {customization.weaponId}</p>
            <p>Parts: {customization.parts.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customizer;
