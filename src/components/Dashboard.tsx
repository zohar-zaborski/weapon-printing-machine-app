import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { authAtom } from '../atoms/authAtoms';
import authService from '../services/auth.service';

interface Weapon {
  name: string;
  compatible_parts: string[];
}

const Dashboard: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    authService.logout();
  };

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const data = await authService.getWeapons();
        setWeapons(data);
      } catch (err) {
        console.error('Failed to fetch weapons:', err);
        setError('Failed to fetch weapons. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWeapons();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  if (loading) {
    return <p>Loading weapons...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Weapons Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/customize">
        <button>Customize a Weapon</button> {/* Navigation button to Customizer */}
      </Link>
      <ul>
        {weapons.map((weapon, index) => (
          <li key={index}>
            <h2>{weapon.name}</h2>
            <p>Compatible Parts: {weapon.compatible_parts.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
