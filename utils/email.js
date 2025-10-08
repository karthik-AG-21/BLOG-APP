import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    },
});
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");

const gmailTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email
export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({  // Changed from brevoTransporter
            from: `"blog" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        try {
            await gmailTransporter.sendMail({
                from: `"blog" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });
        } catch (gmailError) {
            throw gmailError; // Re-throw to handle in calling function
        }
    }
};

export default transporter;