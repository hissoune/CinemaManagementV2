const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
    
      
 const { name, email, password,role } = req.body;
        
    const newUser = new User({ name, email, password ,role});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
