const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist'); 

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ msg: 'Authorization token not found' });
  }

  try {
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token is invalid. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; 
       
    if (req.path.startsWith('/api/admins') || req.path.startsWith('/api/auth') || req.path.startsWith('/api/movies') || req.path.startsWith('/api/roomes') || req.path.startsWith('/api/sessions')|| req.path.startsWith('/api/seats') ) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
      }
      return next(); 
    }
    if (req.path.startsWith('/api/reservations')) {
       if (req.user.role !== 'client') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
      }
            return next(); 


    }

    next(); 
  } catch (err) {
    console.error(err); 
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
