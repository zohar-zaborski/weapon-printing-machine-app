import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { authAtom } from "../atoms/authAtoms";
import authService from "../services/auth.service";
import { getParts } from "../services/parts.service";
import { Weapon, Part } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWeapons } from "../services/weapons.service";

const Dashboard: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    authService.logout();
  };

  useEffect(() => {
    const fetchWeaponsAndParts = async () => {
      try {
        const fetchedWeapons = await getWeapons();
        console.log("Fetched Weapons:", fetchedWeapons);
        const fetchedParts = await getParts();
        console.log("Fetched Parts:", fetchedParts);

        setWeapons(
          fetchedWeapons.map((weapon: Weapon) => ({
            ...weapon,
            compatibleParts:
              typeof weapon.compatible_parts === "string"
                ? weapon.compatible_parts.split(",") // Split if it's a string
                : weapon.compatible_parts, // Use as-is if it's already an array
          }))
        );

        setParts(
            fetchedParts.map((part: Part) => ({
              ...part,
              compatibleWeapons: Array.isArray(part.compatible_weapons)
                ? part.compatible_weapons
                : [], // Ensure it's an array or default to empty
            }))
        );
      } catch (err) {
        console.error("Failed to fetch weapons or parts:", err);
        setError("Failed to fetch weapons or parts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWeaponsAndParts();
    }
  }, [isAuthenticated]);

  // Helper to get part names from part IDs
  const getPartNames = (compatibleParts: string[]) => {
    console.log("Compatible Parts IDs:", compatibleParts);
    console.log("Parts in State:", parts);

    return compatibleParts
      .map((id) => {
        // Ensure `id` and `part.id` are of the same type
        const part = parts.find((part) => part.id === parseInt(id, 10)); // Parse `id` as integer
        console.log("Matching Part:", part);
        return part ? part.name : `Part ID: ${id}`;
      })
      .join(", ");
  };

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <span className="navbar-brand">Dashboard</span>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/customize">
                  Customize
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/saved-weapons">
                  Saved Weapons
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/print-jobs">
                  Print Jobs
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        {/* Weapons List */}
        <div className="mb-5">
          <h3>Weapons</h3>
          {weapons.length === 0 ? (
            <p>No weapons available.</p>
          ) : (
            <div className="list-group">
              {weapons.map((weapon, index) => (
                <div key={index} className="list-group-item">
                  <h5>{weapon.name}</h5>
                  <p>
                    Compatible Parts:{" "}
                    {getPartNames(
                      Array.isArray(weapon.compatible_parts)
                        ? weapon.compatible_parts
                        : weapon.compatible_parts
                        ? weapon.compatible_parts.split(",")
                        : [] // Default to an empty array if undefined
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parts List */}
        <div>
          <h3>Weapon Parts</h3>
          {parts.length === 0 ? (
            <p>No parts available.</p>
          ) : (
            <div className="list-group">
              {parts.map((part, index) => (
                <div key={index} className="list-group-item">
                  <h5>{part.name}</h5>
                  <p>Type: {part.type}</p>
                  <p>
                    Compatible Weapons:{" "}
                    {part.compatible_weapons.length > 0
                      ? part.compatible_weapons.join(", ")
                      : "No compatible weapons"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
