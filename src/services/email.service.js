export const emailService = async (
  magicLink,
  customerEmail,
  expires_at,
  requestedDocumentsArray
) => {
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

  // Format requested documents into an HTML list
  const documentListHTML = requestedDocumentsArray
    .map((title) => `<li style="margin-bottom: 6px;">📎 ${title}</li>`)
    .join("");

  try {
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.BROKER_EMAIL}>`,
      to: customerEmail,
      subject: `Document Request from ${process.env.COMPANY_NAME} — Action Required`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="background: #4f46e5; color: white; padding: 20px;">
              <h2 style="margin: 0;">Action Required: Document Submission</h2>
            </div>
            <div style="padding: 24px;">
              <p>Hi there,</p>
              <p><strong>${process.env.COMPANY_NAME}</strong> has requested the following documents from you:</p>
              <ul style="padding-left: 20px; margin-top: 12px; margin-bottom: 20px;">
                ${documentListHTML}
              </ul>
              <p>Please click the button below to securely submit your documents:</p>
              <a href="${magicLink}" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
                Click to Submit Documents
              </a>
              <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                This secure link will expire in <strong>${expires_at}</strong> minutes. If you weren’t expecting this, please ignore this email.
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
