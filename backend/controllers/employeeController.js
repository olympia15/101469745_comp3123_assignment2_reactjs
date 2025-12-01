const Employee = require('../models/Employee');

// GET /api/v1/emp/employees - retrieve all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();

        const formattedEmployees = employees.map(emp => ({
            employee_id: emp._id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            hireDate: emp.hireDate,
            department: emp.department
        }));

        res.status(200).json(formattedEmployees);

    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error fetching employees"
        });
    }
};

// POST /api/v1/emp/employees - create a new employee
const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, position, salary, hireDate, department } = req.body;

        // check if employee with the same email already exists
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                status: "false",
                message: "Employee already exists with this email"
            });
        }

        // create a new employee
        const employee = new Employee({ firstName, lastName, email, position, salary, hireDate, department });
        await employee.save();

        res.status(201).json({
            message: "Employee created successfully",
            employee_id: employee._id
        });

    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error creating employee"
        });
    }
};

// GET /api/v1/emp/employees/:id - retrieve an employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        res.status(200).json({
            employee_id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            position: employee.position,
            salary: employee.salary,
            hireDate: employee.hireDate,
            department: employee.department
        });

    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error fetching employee"
        });
    }
};

// PUT /api/v1/emp/employees/:id - update an employee by ID
const updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee_id: employee._id
        });

    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error updating employee"
        });
    }
};

// DELETE /api/v1/emp/employees?id=xxx - delete an employee by ID
const deleteEmployeeById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                status: "false",
                message: "Employee ID is required"
            });
        }

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        res.status(204).send(); // no content response

    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error deleting employee"
        });
    }
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById
};