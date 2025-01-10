// /src/middleware/multerConfig.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Import Cloudinary config

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Use the cloudinary instance
  params: {
    folder: "myapp_images", // Folder name in Cloudinary (optional)
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"], // Allowed formats
  },
});

// Multer setup with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
