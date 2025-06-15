import "dotenv/config.js";
import nodemailer from "nodemailer";

export const emailService = async (magicLink, customerEmail, expires_at) => {
  if (!customerEmail || !magicLink) {
    return { error: "Email and magic link are required." };
  }
  console.log("Sending email to:", customerEmail);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.BROKER_EMAIL}>`,
      to: customerEmail,
      subject: `You're invited to ${process.env.COMPANY_NAME} — Click to Sign In`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #4f46e5; color: white; padding: 20px;">
              <h2>You're invited to ${process.env.COMPANY_NAME}</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hello,</p>
              <p>You’ve been invited to join ${process.env.COMPANY_NAME}. Click the button below to sign in securely:</p>
              <a href="${magicLink}" style="display: inline-block; margin-top: 15px; padding: 12px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
                Sign in to your account
              </a>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">
                This magic link will expire in ${expires_at} minutes. If you didn’t request this, you can safely ignore this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email." };
  }
};
