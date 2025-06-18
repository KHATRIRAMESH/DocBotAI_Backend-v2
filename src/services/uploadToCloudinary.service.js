import { v2 as cloudinary } from "cloudinary";
import "dotenv/config.js";

console.log("Configuring Cloudinary...", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(fileBuffer, mimeType, originalname) {
  return new Promise((resolve, reject) => {
    const extension = mimeType.split("/")[1];
    const publicId = originalname.replace(/\.[^/.]+$/, "");

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: mimeType.startsWith("image") ? "image" : "raw",
        folder: "docbot_ai",
        public_id: publicId,
        format: extension,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}
