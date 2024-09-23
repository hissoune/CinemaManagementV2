const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});






    


exports.sendCredentials = (email, username, password) => {
        
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Login Credentials',
    html: `<p>Hello, your credentials are:</p><ul><li><strong>Username:</strong> ${username}</li><li><strong>Password:</strong> ${password}</li>
    <li><strong>Email:</strong> ${email}</li>
     <li><strong>use the email and the password to sign in  </strong></li>
      </ul>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.sendRessetPass=async(email, urlToken)=> {
  await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Please click on the following link to reset your password: ${urlToken}`,
    });
}
