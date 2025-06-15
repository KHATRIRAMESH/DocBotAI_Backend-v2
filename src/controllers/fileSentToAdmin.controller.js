export async function fileSentToAdmin(req, res) {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }
  } catch (error) {}
}
