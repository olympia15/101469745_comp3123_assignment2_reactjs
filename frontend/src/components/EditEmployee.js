import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EmployeeForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function EditEmployee() {

    // set default states
    const { id } = useParams();
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
    const [fetchLoading, setFetchLoading] = useState(true);

    // fetch employees on component mount
    useEffect(() => {
        fetchEmployee();
    }, [id]);

    // fetch employee data
    const fetchEmployee = async () => {

        // fetch employee data from API
        try{

            // make API call
            const response = await axios.get(`${API_URL}/api/v1/emp/employees/${id}`);
            const employee = response.data;

            // populate form with fetched data
            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                position: employee.position,
                department: employee.department,
                salary: employee.salary,
                hireDate: employee.hireDate.split('T')[0] // format date for input
            });

            setFetchLoading(false);
        } catch (error) {

            console.error('Error fetching employee:', error);
            setError('Failed to fetch employee data.');
            setFetchLoading(false);
        }
    };

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // validate form data
    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.department || !formData.salary || !formData.hireDate) {
            setError('All fields are required.');
            return false;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailRegex.test(formData.email)) {
            setError('Invalid email format.');
            return false;
        }

        if (formData.salary < 0) {
            setError('Salary must be a positive number.');
            return false;
        }

        return true;
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // send update request to API
        try {
            await axios.put(`${API_URL}/api/v1/emp/employees/${id}`, formData);
            setLoading(false);
            alert('Employee updated successfully!');
            navigate('/employees');
        }catch (error) {
            setError(error.response?.data?.message || 'Failed to update employee.');
        }finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className='error-message'>Loading employee data...</div>;
    }

    return (
    <div className="form-container">
      <div className="form-card">
        <h2>Edit Employee</h2>
        
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
              {loading ? 'Updating...' : 'Update Employee'}
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

export default EditEmployee;