import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/';

function EmployeeList(){

    // set default states
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDepartment, setSearchDepartment] = useState('');
    const [searchPosition, setSearchPosition] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // fetch employees on component mount
    useEffect(() => {

        const userData = localStorage
        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchEmployees();
    }, []);

    // function to fetch employees from API
    const fetchEmployees = async () => {
        
        // make API call to fetch employees
        try {

            const response = await axios.get(`${API_URL}/api/v1/emp/employees`);
            setEmployees(response.data);
            setFilteredEmployees(response.data);
            setLoading(false);
        
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    }

    // function to handle search
    const handleSearch = async () => {

        // if no search criteria, reset to all employees
        if (!searchDepartment && !searchPosition) {
            setFilteredEmployees(employees);
            return;
        }

        // make API call to search employees
        try {

            const params = {};
            if (searchDepartment) params.department = searchDepartment;
            if (searchPosition) params.position = searchPosition;

            const response = await axios.get(`${API_URL}/api/v1/emp/employees/search`, { params });
            setFilteredEmployees(response.data);
        } catch (error) {
            console.error('Error searching employees:', error);
        };
    }

    // function to clear search criteria
    const clearSearch = () => {
        setSearchDepartment('');
        setSearchPosition('');
        setFilteredEmployees(employees);
    };

    // function to handle delete employee
    const handleDelete = async (id) => {

        // confirm deletion
        if (window.confirm('Are you sure you want to delete this employee?')) {
            
            // make API call to delete employee
            try {
                await axios.delete(`${API_URL}/api/v1/emp/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee. Please try again.');
            }
        }
    }

    // function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }

    if (loading) {
        return <div className="loading">Loading employees...</div>;
    }

    return (
    <div className="employee-list-container">
      <div className="header">
        <div className="header-content">
          <h2>Employee Management App</h2>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="actions-bar">
          <button onClick={() => navigate('/employees/add')} className="btn-add">
            Add New Employee
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Department"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Position"
            value={searchPosition}
            onChange={(e) => setSearchPosition(e.target.value)}
          />
          <button onClick={handleSearch} className="btn-search">Search</button>
          <button onClick={clearSearch} className="btn-clear">Clear</button>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="no-employees">No employees found</div>
        ) : (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.position}</td>
                    <td>{employee.department}</td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button 
                        onClick={() => navigate(`/employees/view/${employee.employee_id}`)}
                        className="btn-view"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => navigate(`/employees/edit/${employee.employee_id}`)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(employee.employee_id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;

