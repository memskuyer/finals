const express = require("express");
const router = express.Router();
const controller = require("../controller/controllerCrud");
const upload = require("../middleware/multerConfig"); // Middleware to upload to Cloudinary

// POST route for adding a project
router.post("/add-myproject", upload.single("image"), controller.addMyProject);

// DELETE and PATCH routes for CRUD operations
router.delete("/delete-myproject/:id", controller.deleteMyProject);
router.patch(
  "/edit-myproject/:id",
  upload.single("image"),
  controller.editMyProject
);

module.exports = router;
