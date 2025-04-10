// controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create user
    const user = await User.create({
      email,
      password, // Will be hashed by the pre-save hook
    });

    res.status(201).json({ msg: "User created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    console.log("Setting cookie with options:", cookieOptions);

    res.cookie("token", token, cookieOptions).json({
      msg: "Logged in",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    .json({ msg: "Logged out" });
};
exports.checkAuth = async (req, res) => {
  try {
    // If the middleware allowed the request to reach here, the user is authenticated
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
};
