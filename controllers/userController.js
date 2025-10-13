const User = require('../models/userModel');

// POST /api/v1/user/signup
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                status: "false",
                message: "User already exists with this username or email"
            });
        }

        // create a new user (password automatically hashed in pre-save hook)
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user_id: user._id
        });

    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error during user signup"
        });
    }
};

// POST /api/v1/user/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email or username
        const user = await User.findOne({
            $or: [{ email }, { username: email }]
        });

        if (!user) {
            return res.status(400).json({
                status: "false",
                message: "Invalid email/username or password"
            });
        }

        // check password using the comparePassword method
        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid) {
            return res.status(400).json({
                status: "false",
                message: "Invalid email/username or password"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });
        
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({
            status: "false",
            message: error.message || "Error during user login"
        });
    }
};

module.exports = {
    signUp,
    login
};