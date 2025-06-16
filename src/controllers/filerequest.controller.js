export async function submitFileRequest(req, res) {
  try {
    const senderId = req.userId;
      const { receiverId, fileList } = req.body;
      
  } catch (error) {
    res.status(500).send(error);
  }
}
