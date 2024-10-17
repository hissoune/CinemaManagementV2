const authService = require('../services/authService');
const { uploadToMinIO } = require('../services/uploadService');

exports.login =  (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
  }

  authService.login(email, password).then((response) => {  
          res.json(response);
      })
      .catch(err => {
       
        
          res.status(500).json({ msg: err.message }); 
      });
     
 
};




exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.files.image; 
  const image = await uploadToMinIO(imageFile[0]);
    authService.register({ name, email, password ,image}).then(({ token, user }) => {  
    res.json({ token, user });
})
.catch(err => {
    res.status(500).json({ msg: err.message }); 
});
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


exports.updateprofile = async (req,res)=>{
    
     const userId = req.user.id;
     const updatedData = req.body;
     const imageFile = req.files.image; 
     const image = await uploadToMinIO(imageFile[0]);
     authService.updateUser(userId,updatedData,image)
     .then((user) => {
       res.status(200).json(user);
     })
     .catch((err) => {
       res.status(500).json({ message: 'Error updating profile', error: err.message });
     });

};
exports.favorites =async (req,res)=>{
 
  
  const movieId = req.params.movieId;
  console.log(movieId);
  
  const userId = req.user.id;
  authService.favorites(movieId,userId)
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  });

}
