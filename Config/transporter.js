import nodemailer from "nodemailer";

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
  //  const GMAIL_USER:"prathameshk990@gmail.com",
  // const GMAIL_PASS:"ivwcgjbspkbyyndo",
  // const GMAIL_HOST:"smtp.gmail.com",
  host: "smtp.gmail.com",
  auth: {
    user: "prathameshk990@gmail.com", // Your sender Gmail address
    pass: "ivwcgjbspkbyyndo", // Your Gmail app-specific password
  },
});

export default transporter;
