const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Remove "Bearer " if present
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle hardcoded admin
    if (decoded.id === "admin-id") {
      req.user = { 
        _id: "admin-id", 
        role: "admin", 
        name: "admin@gmail.com", 
        email: "admin@gmail.com" 
      };
      return next();
    }

    // Attach user object from DB to req
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // now req.user.role and req.user.id are available
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires role: ${roles.join(", ")}` });
    }

    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
