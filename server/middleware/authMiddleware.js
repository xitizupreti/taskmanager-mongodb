const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // If no token is present, return unauthorized
    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Not authorized, token failed" });
  }
};
