const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById
} = require('../controllers/employeeController');

// GET /api/v1/emp/employees - get all employees
router.get('/employees', getAllEmployees);

// POST /api/v1/emp/employees - create a new employee
router.post('/employees', createEmployee);

// GET /api/v1/emp/employees/:id - get employee by ID
router.get('/employees/:id', getEmployeeById);

// PUT /api/v1/emp/employees/:id - update employee by ID
router.put('/employees/:id', updateEmployeeById);

// DELETE /api/v1/emp/employees/ - delete employee using query param
router.delete('/employees', deleteEmployeeById);

module.exports = router;
