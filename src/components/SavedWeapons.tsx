import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtoms";
import {
  getCustomizations,
  printCustomization,
  deleteCustomization,
} from "../services/customization.service";
import { Customization } from "../types";

import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "../components/AppNavbar";

const SavedCustomizations: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch customizations
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const fetchedCustomizations = await getCustomizations();
        setCustomizations(fetchedCustomizations);
      } catch (error) {
        console.error("Error details:", error);
        setMessage("Failed to fetch customizations or weapon details.");
      }
    };

    fetchCustomizations();
  }, []);

  // Handle Print
  const handlePrint = async (customizationId: number) => {
    try {
      await printCustomization(customizationId);
      setMessage("Customization sent to print successfully!");
    } catch (error) {
      console.error("Failed to send customization to print:", error);
      setMessage("Failed to send customization to print.");
    }
  };

  // Handle Delete Customization
  const handleDelete = async (customizationId: number) => {
    try {
      await deleteCustomization(customizationId);
      setMessage("Customization deleted successfully!");
      // Remove the deleted customization from the state
      setCustomizations((prev) =>
        prev.filter((customization) => customization.id !== customizationId)
      );
    } catch (error) {
      console.error("Failed to delete customization:", error);
      setMessage("Failed to delete customization.");
    }
  };

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div>
      <AppNavbar />

      {/* Saved Customizations */}
      <div className="container mt-5">
        {message && <div className="alert alert-info">{message}</div>}
        <h3>Saved Customizations</h3>
        {customizations.length === 0 ? (
          <p>No customizations available.</p>
        ) : (
          <div className="row">
            {customizations.map((customization, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Weapon ID: {customization.weapon_id}</h5>
                    <p className="card-text">
                      <strong>Parts IDs:</strong> {customization.parts.join(", ")}
                    </p>
                    <p className="card-text">
                      <strong>Print Job ID:</strong> {customization.id}
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePrint(customization.id)}
                      >
                        Print Customization
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customization.id)}
                      >
                        Delete Customization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCustomizations;
