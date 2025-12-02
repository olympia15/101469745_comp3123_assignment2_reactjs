import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function Login() {

    // set the default states
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // handle form data change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError('');
    }

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // form validation
        if(!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        // call the login API
        try {

            const apiUrl = 'http://localhost:3000/api/v1/user/login';
            const response = await axios.post(apiUrl, formData);

            if(response.data.user){
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/employees');
            }

        }catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }finally {
            setLoading(false);
        }
    };

return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Employee Management App</h2>
        <h3>Login</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email or Username</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;