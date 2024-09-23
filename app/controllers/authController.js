const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');
const JWT_SECRET = process.env.JWT_SECRET;
const mailer = require('../utils/mailer');
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.logout = async (req, res) => {
  
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.decode(token);

    await Blacklist.create({
      token: token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    res.status(200).json({ msg: 'Successfully logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPass = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const resetUrl = `http://localhost:3000/api/reset-password-fromemail/${resetToken}`;

    mailer.sendRessetPass(email, resetUrl);
    res.status(200).json({ msg: 'Password reset email sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  
   const { token } = req.params;
  const { newPassword } = req.body;

  try {

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    

     const salt = await bcrypt.genSalt(10);
    hashedPass = await bcrypt.hash(newPassword, salt);
 const user=await User.findByIdAndUpdate(userId, { password: hashedPass });
  
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    
    // user.password = hashedPass;
    // await user.save();

        res.status(200).json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Invalid or expired token' });
  }

}


