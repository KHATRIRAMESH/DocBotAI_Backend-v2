import { generateAndSendMagicLink } from "../services/magiclink.service.js";

export async function sendMagicLink(req, res) {
  console.log("requester:", req.user);

  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const { email, requestedDocumentsArray } = req.body;
  const adminUser = req.user;
  const adminId = adminUser.id; // Ensure admin is logged in

  try {
    await generateAndSendMagicLink(email, adminId, requestedDocumentsArray);
    res.status(200).json({
      success: true,
      message: "Magic link sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending magic link.",
      error: error.message,
    });
  }
}
