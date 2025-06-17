export aync function uploadDocuments(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const file = req.files[0];
    console.log("Uploaded file:", file);

    // Here you can process the file, e.g., save it to a database or cloud storage
    // For demonstration, we'll just return the file information
    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Error uploading file", error });
  }
}
} else {
    return { success: false, message: "Invalid credentials" };
  }
