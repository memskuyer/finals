// /src/Router/uploadRoute.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig"); // Multer middleware

// Route for uploading images
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Get the uploaded image URL from Cloudinary
  const imageUrl = req.file.path; // URL of the uploaded image
  const imagePublicId = req.file.public_id; // Public ID of the uploaded image

  // Respond with the image URL and other info
  res.json({
    message: "Image uploaded successfully",
    imageUrl,
    imagePublicId,
  });
});

module.exports = router;
