import transporter from "./transporter.js";
import createMailOptions from "./mailOptions.js";


// Function to send the welcome email after user signup
const sendmail = async (to, username, password) => {
  const mailOptions = createMailOptions(to, username, password);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export default sendmail;
