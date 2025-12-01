import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function AddEmployee() {

    // set default states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        hireDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    }

    // validate form data
    const validateForm = () => {

        // check for empty required fields
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() ||
            !formData.position.trim() || !formData.department.trim() || !formData.salary ||
            !formData.hireDate) {
            setError('Please fill in all required fields.');
            return false;
        }

        // basic email format validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }

        // salary must be a positive number
        if (formData.salary < 0) {
            setError('Salary cannot be negative.');
            return false;
        }
        return true;
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // validate form data
        if (!validateForm()) {
            return;
        }

        // show loading state
        setLoading(true);

        // submit form data to API
        try {
            await axios.post(`${API_URL}/api/v1/emp/employees`, formData);
            alert('Employee added successfully!');
            navigate('/employees');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add employee. Please try again.');
        }finally {
            setLoading(false);
        }
    };

    return (
    <div className="form-container">
      <div className="form-card">
        <h2>Add New Employee</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hireDate">Hire Date</label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/employees')} 
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;