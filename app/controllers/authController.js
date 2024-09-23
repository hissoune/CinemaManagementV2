const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const newUser =await authService.register({ name, email, password, role });
    res.status(200).json(newUser);
    
  } catch (error) {
    res.status(400).json({msg:error.message})
  }

}

exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    await authService.logout(token);
    res.status(200).json({ msg: 'Successfully logged out' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    await authService.requestPasswordReset(email);
    res.status(200).json({ msg: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
