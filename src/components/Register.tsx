import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../services/auth.service';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(username, password, email); // Call register API
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error('Registration failed:', err);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
