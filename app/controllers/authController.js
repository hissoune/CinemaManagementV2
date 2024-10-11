const authService = require('../services/authService');

exports.login =  (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  authService.login(email, password).then((token) => {
    res.json({ token })
  });
 
};
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const token = await authService.register({ name, email, password });
    res.status(200).json({ token }); // Send the token inside an object
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

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


exports.profile = (req, res) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  authService.Profile(token)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching profile', error: err.message });
    });
};

