const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "`First name cannot exceed 50 characters`]"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email."
        }
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true,
        maxlength: [100, "Position cannot exceed 100 characters"]
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"]
    },
    hireDate: {
        type: Date,
        required: [true, "Hire date is required"]
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
        maxlength: [100, "Department cannot exceed 100 characters"]
    }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
