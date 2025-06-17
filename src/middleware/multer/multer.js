import multer from "multer";
import Storage from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const storage = new Storage({ keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE });
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

const multerStorage = multer.memoryStorage(); // store in RAM before uploading to GCS
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}); // 10 MB limit

const uploadToGCS = async (file, folder = "customer-uploads") => {
  const blobName = `${folder}/${uuidv4()}-${file.originalname}`;
  const blob = bucket.file(blobName);

  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", async () => {
      await blob.makePublic(); // 🟢 Make file public

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

export { upload, uploadToGCS };
