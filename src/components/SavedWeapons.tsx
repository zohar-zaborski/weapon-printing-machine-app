import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { authAtom } from '../atoms/authAtoms';
import { getCustomizations, printCustomization } from '../services/customization.service';
import authService from '../services/auth.service';
import { Weapon, Customization } from '../types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getWeaponById } from '../services/weapons.service';

const SavedCustomizations: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [weaponDetails, setWeaponDetails] = useState<{ [key: number]: Weapon }>({});
  const [message, setMessage] = useState<string | null>(null);

  // Fetch customizations and weapon details
  useEffect(() => {
    const fetchCustomizationsAndWeapons = async () => {
      try {
        // Fetch customizations
        const fetchedCustomizations = await getCustomizations();
        setCustomizations(fetchedCustomizations);

        // Fetch weapon details for each customization
        const fetchedWeapons: { [key: number]: Weapon } = {};
        for (const customization of fetchedCustomizations) {
          const weapon = await getWeaponById(customization.weaponId);
          fetchedWeapons[customization.weaponId] = weapon;
        }
        setWeaponDetails(fetchedWeapons);
      } catch (error) {
        console.error('Failed to fetch customizations or weapon details:', error);
        setMessage('Failed to fetch customizations or weapon details.');
      }
    };

    fetchCustomizationsAndWeapons();
  }, []);

  const handlePrint = async (customizationId: number) => {
    try {
      await printCustomization(customizationId);
      setMessage('Customization sent to print successfully!');
    } catch (error) {
      console.error('Failed to send customization to print:', error);
      setMessage('Failed to send customization to print.');
    }
  };

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <span className="navbar-brand">Saved Customizations</span>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/customize">
                  Customize
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/print-jobs">
                  Print Jobs
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm nav-link" onClick={authService.logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Saved Customizations */}
      <div className="container mt-5">
        {message && <div className="alert alert-info">{message}</div>}
        <h3>Saved Customizations</h3>
        {customizations.length === 0 ? (
          <p>No customizations available.</p>
        ) : (
          <div className="list-group">
            {customizations.map((customization, index) => (
              <div key={index} className="list-group-item">
                <h5>Weapon: {weaponDetails[customization.weaponId]?.name || 'Loading...'}</h5>
                <p>Parts: {customization.parts.join(', ')}</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handlePrint(customization.id)}
                >
                  Print Customization
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCustomizations;
