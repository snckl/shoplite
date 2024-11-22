import EmailOptions from "../types/EmailOptions";
import nodemailer from "nodemailer";

export default async function sendEmail(options: EmailOptions) {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Replace with your SMTP server
    port: 587, // Replace with your SMTP port
    auth: {
      user: process.env.SMTP_EMAIL, // Replace with your email
      pass: process.env.SMTP_PASSWORD, // Replace with your email password
    },
  });

  // Send mail with defined transport object
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
