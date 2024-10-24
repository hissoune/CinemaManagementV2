const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist'); 
const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/reset-password','api/sessions/public','api/public','/uploads','/api-docs'];

const verifyToken = async (req, res, next) => {
  
  if (publicRoutes.includes(req.path)) {

    return next(); 
   
  }
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ msg: 'Authorization token not found' });
  }

  try {
    // const isBlacklisted = await Blacklist.findOne({ token });
    // if (isBlacklisted) {
    //   return res.status(401).json({ msg: 'Token is invalid. Please log in again.' });
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; 

    switch (true) {
      case req.path.startsWith('/api/auth'):
        if (token && !req.path.startsWith('/api/auth/logout')&&!req.path.startsWith('/api/auth/profile')) {
          return res.status(302).json({ msg: 'You are already logged in. Please log out first.' });

        }
        break;

      case req.path.startsWith('/api/admins'):
      case req.path.startsWith('/api/movies'):
      case req.path.startsWith('/api/reservations/admin'):
        
      case req.path.startsWith('/api/rooms'):
      case req.path.startsWith('/api/sessions'):
        if (req.user.role !== 'admin') {
          return res.status(403).json({ msg: 'Access denied: Admins only' });
        }
        break;
       case req.path.startsWith('/api/movies/rating'):
      case req.path.startsWith('/api/reservations'):
        if (req.user.role !== 'client') {
          return res.status(403).json({ msg: 'Access denied: Clients only' });
        }
        break;

      default:
        break;
    }

    next(); 
  } catch (err) {
    console.error(err); 
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
