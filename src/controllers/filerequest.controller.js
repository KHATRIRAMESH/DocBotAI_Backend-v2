export async function submitFileRequest(req, res) {
  try {
    const adminUser = req.user;
    const senderId = adminUser.id;
    const { receiverId, fileList } = req.body;
  } catch (error) {
    res.status(500).send(error);
  }
}
