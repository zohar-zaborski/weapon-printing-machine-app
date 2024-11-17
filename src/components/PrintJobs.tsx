import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        const response = await fetch('http://127.0.0.1:8000/print_jobs/print/jobs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setPrintJobs(data);
      } catch (err) {
        console.error('Failed to fetch print jobs:', err);
        setError('Failed to fetch print jobs. Please try again.');
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
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <span className="navbar-brand">Print Jobs</span>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <h3>Print Jobs</h3>
        {printJobs.length === 0 ? (
          <p>No print jobs available.</p>
        ) : (
          <div className="list-group">
            {printJobs.map((job) => (
              <div key={job.id} className="list-group-item">
                <h5>Print Job ID: {job.id}</h5>
                <p>Customized Weapon ID: {job.customized_weapon_id}</p>
                <p>Status: {job.status}</p>
                <p>Created At: {formatDate(job.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintJobs;
