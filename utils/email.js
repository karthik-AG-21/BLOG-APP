import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_USER, // smtp-relay.brevo.com
    port: 587, // or 465 if you use SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_FROM, // your Brevo email (e.g., karthikjr2004jr@gmail.com)
      pass: process.env.SMTP_PASS, // API key from Brevo
    },
  });

  await transporter.sendMail({
    from: `"Aahar" <${process.env.EMAIL_FROM}>`, // or any name you want
    to,
    subject,
    text,
  });
};
