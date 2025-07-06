import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/simple_dashboard'); // Navigate to /simple_dashboard on successful login
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div>
          <h2>GDG Admin Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? <Loader2 className="spinner" /> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
