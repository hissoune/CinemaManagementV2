const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist'); // Ensure you're importing the blacklist model

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

    next(); 
  } catch (err) {
    console.error(err); 
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
