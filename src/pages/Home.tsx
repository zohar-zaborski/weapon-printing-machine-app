import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtoms";
import { getParts } from "../services/parts.service";
import { Weapon, Part } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWeapons } from "../services/weapons.service";
import AppNavbar from "../components/AppNavbar";
import { upcomingWeapons } from "../mock/upcomingWeapons";
const Home: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchWeaponsAndParts = async () => {
      try {
        const fetchedWeapons = await getWeapons();
        const fetchedParts = await getParts();

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
  

    return compatibleParts
      .map((id) => {
        // Ensure `id` and `part.id` are of the same type
        const part = parts.find((part) => part.id === parseInt(id, 10)); // Parse `id` as integer
        return part ? part.name : `Part ID: ${id}`;
      })
      .join(", ");
  };

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  if (loading) {
    return <p>Loading Home...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <AppNavbar />
      <div className="container mt-5">
        {/* Weapons List */}
        <div className="mb-5">
          <h3>Weapons</h3>
          {weapons.length === 0 ? (
            <p>No weapons available.</p>
          ) : (
            <div className="row">
              {weapons.map((weapon, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{weapon.name}</h5>
                      <p className="card-text">
                        <strong>Compatible Parts:</strong>{" "}
                        {getPartNames(
                          Array.isArray(weapon.compatible_parts)
                            ? weapon.compatible_parts
                            : weapon.compatible_parts
                            ? weapon.compatible_parts.split(",")
                            : [] // Default to an empty array if undefined
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Weapon Parts */}
        <div className="mb-5">
          <h3>Weapon Parts</h3>
          {parts.length === 0 ? (
            <p>No parts available.</p>
          ) : (
            <div className="row">
              {parts.map((part, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{part.name}</h5>
                      <p className="card-text">
                        <strong>Type:</strong> {part.type}
                      </p>
                      <p className="card-text">
                        <strong>Compatible Weapons:</strong>{" "}
                        {part.compatible_weapons.length > 0
                          ? part.compatible_weapons.join(", ")
                          : "No compatible weapons"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Upcoming Weapons */}
        <div className="mb-5">
          <h3>Upcoming Weapons...</h3>
          <div className="row">
            {upcomingWeapons.map((weapon, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{weapon.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Home;
