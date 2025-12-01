import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewEmployee.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function ViewEmployees(){

    // set default states
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    // fetch employees on component mount
    useEffect(() => {
        fetchEmployee();
    }, [id]);

    // fetch employee by id
    const fetchEmployee = async () => {
        
        // send get request to API
        try {
            const response = await axios.get(`${API_URL}/api/v1/emp/employees/${id}`);
            setEmployee(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee:', error);
            setLoading(false);
        }  
    };

    if (loading) {
        return <div className='loading'>Loading employee details...</div>;
    }

    if (!employee) {
        return <div className='error'>Employee not found.</div>;
    }

    return (
    <div className="view-container">
      <div className="view-card">
        <h2>Employee Details</h2>
        
        <div className="employee-details">
          <div className="profile-placeholder-large">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <label>First Name:</label>
              <span>{employee.firstName}</span>
            </div>

            <div className="detail-item">
              <label>Last Name:</label>
              <span>{employee.lastName}</span>
            </div>

            <div className="detail-item">
              <label>Email:</label>
              <span>{employee.email}</span>
            </div>

            <div className="detail-item">
              <label>Position:</label>
              <span>{employee.position}</span>
            </div>

            <div className="detail-item">
              <label>Department:</label>
              <span>{employee.department}</span>
            </div>

            <div className="detail-item">
              <label>Salary:</label>
              <span>${employee.salary.toLocaleString()}</span>
            </div>

            <div className="detail-item">
              <label>Hire Date:</label>
              <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
            </div>

            <div className="detail-item">
              <label>Employee ID:</label>
              <span>{employee.employee_id}</span>
            </div>
          </div>
        </div>

        <div className="view-actions">
          <button 
            onClick={() => navigate(`/employees/edit/${id}`)} 
            className="btn-primary">
            Edit Employee
          </button>
          <button 
            onClick={() => navigate('/employees')} 
            className="btn-secondary">
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployees;