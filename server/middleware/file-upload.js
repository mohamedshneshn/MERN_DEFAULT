const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: {
    fileSize: 800000, // 800 KB in bytes
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".").pop(); // Extract extension from the original filename
      cb(null, Date.now() + "." + ext); // Append the extracted extension to the timestamp for a unique filename
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValidMimeType = Object.keys(MIME_TYPE_MAP).includes(file.mimetype);
    if (isValidMimeType) {
      cb(null, true); // Allow the upload if the MIME type is recognized
    } else {
      cb(new Error("Invalid file type")); // Reject the upload if the MIME type is unrecognized
    }
  },
});

module.exports = fileUpload;
