const userService = require('../services/adminService');

exports.createUser = async (req, res) => {
    try {
    
      
 const { name, email, password,role } = req.body;
        
    const newUser =await userService.createUser( {name, email, password,role })
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
