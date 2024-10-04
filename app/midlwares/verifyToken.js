const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');

// Define routes that don't require token verification (public routes)
const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/logout'];

const verifyToken = async (req, res, next) => {
  // Bypass token verification for public routes
  if (publicRoutes.includes(req.path)) {
    return next(); // Continue without verifying token
  }

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: 'Authorization token not found' });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token is invalid. Please log in again.' });
    }

    // Verify the token and decode the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Store the user data in the request

    // Role-based access control
    if (req.path.startsWith('/api/admins') || req.path.startsWith('/api/movies') ||
        req.path.startsWith('/api/rooms') || req.path.startsWith('/api/sessions')) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
      }
    }

    if (req.path.startsWith('/api/reservations')) {
      if (req.user.role !== 'client') {
        return res.status(403).json({ msg: 'Access denied: Clients only' });
      }
    }

    next(); // If token is valid and role checks pass, proceed
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
