import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./AppNavbar";
import { getPrintJobs } from "../services/print.service";

interface PrintJob {
  id: number;
  customized_weapon_id: number;
  status: string;
  created_at: string;
}

const PrintJobs: React.FC = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrintJobs = async () => {
      try {
        const data = await getPrintJobs();
        setPrintJobs(data);
      } catch (err) {
        console.error("Failed to fetch print jobs:", err);
        setError("Failed to fetch print jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrintJobs();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats the date into a readable format
  };

  if (loading) {
    return <p>Loading print jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <AppNavbar />

      {/* Main Content */}
      <div className="container mt-5">
        <h3>Print Jobs</h3>
        {printJobs.length === 0 ? (
          <p>No print jobs available.</p>
        ) : (
          <div className="row">
            {printJobs.map((job) => (
              <div key={job.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Print Job ID: {job.id}</h5>
                    <p className="card-text">
                      <strong>Customized Weapon ID:</strong> {job.customized_weapon_id}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {job.status}
                    </p>
                    <p className="card-text">
                      <strong>Created At:</strong> {formatDate(job.created_at)}
                    </p>
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

export default PrintJobs;
