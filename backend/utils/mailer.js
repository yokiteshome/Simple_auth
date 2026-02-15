const nodemailer = require("nodemailer");
// Importing the nodemailer library to handle email sending.

const sendEmail = async (email, subject, message) => {
  // Defining an asynchronous function named 'sendEmail' that takes 'email', 'subject', and 'message' as arguments.
  const transporter = nodemailer.createTransport({
    // Creating a transporter object using nodemailer which will be responsible for sending the email.
    service: "gmail",
    // Specifying "gmail" as the email service provider.
    auth: {
      // Defining the authentication object.
      user: process.env.EMAIL_USER,
      // Setting the email user from the environment variables.
      pass: process.env.EMAIL_PASS,
      // Setting the email password from the environment variables.
    },
    // Closing the authentication object.
  });
  // Closing the createTransport configuration.

  await transporter.sendMail({
    // Asynchronously sending the email using the configured transporter.
    from: process.env.EMAIL_USER,
    // Specifying the sender's email address from environment variables.
    to: email,
    // Specifying the recipient's email address passed as an argument.
    subject: subject,
    // Setting the subject of the email passed as an argument.
    text: message,
    // Setting the body content of the email passed as an argument.
  });
  // Closing the sendMail configuration object.
};
// Closing the sendEmail function definition.

module.exports = sendEmail;
// Exporting the sendEmail function so it can be used in other parts of the application.
