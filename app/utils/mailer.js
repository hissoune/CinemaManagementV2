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

exports.sendRessetPass = async (email, urlToken) => {
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    
    text: `Please click on the following link to reset your password: ${urlToken}`,
  });
  
};

exports.sendTiketMail = async (user, reservation, session,room, movie) => {
  await transporter.sendMail({
    to: user.email,
    subject: 'Session Ticket Confirmation',
    html: `
      <p>Hello ${user.name},</p>
      <p>Your reservation has been confirmed!</p>
      <ul>
        <li><strong>Movie:</strong> ${movie.title}</li>
        <li><strong>Session Date and Time:</strong> ${session.dateTime}</li>
        <li><strong>Room:</strong> ${room.name}</li>
        <li><strong>Seats:</strong> ${reservation.seats}</li>
        <li><strong>Price:</strong> ${session.price} USD</li>
      </ul>
      <p>Thank you for choosing our service! Enjoy your movie!</p>
    `,
  });
}

exports.sendCredentialsUpdated = (updatedUser, password) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: updatedUser.email,
    subject: 'Your Account Credentials Have Been Updated',
    html: `
      <p>Hello ${updatedUser.name},</p>
      <p>Your account credentials have been updated with the following changes:</p>
      <ul>
        ${password ? `<li><strong>Password:</strong> ${password}</li>` : ''}
        ${updatedUser.email ? `<li><strong>Email:</strong> ${updatedUser.email}</li>` : ''}
        ${updatedUser.username ? `<li><strong>Username:</strong> ${updatedUser.username}</li>` : ''}
      </ul>
      <p>If you did not request these changes, please contact support immediately.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending credentials update email:', error);
    } else {
      console.log('Credentials update email sent: ' + info.response);
    }
  });
};

