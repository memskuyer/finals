const express = require("express");
const router = express.Router();

const controller = require("../controller/controllerCrud");
const upload = require("../middleware/upload-image");

router.post("/add-blog", upload.single("image"), controller.addBlog);
router.delete("/delete-blog/:id", controller.deleteBlog);
router.patch("/edit-blog/:id", upload.single("image"), controller.editBlog);

router.post("/add-myproject", upload.single("image"), controller.addMyProject);
router.delete("/delete-myproject/:id", controller.deleteMyProject);
router.patch(
  "/edit-myproject/:id",
  upload.single("image"),
  controller.editMyProject
);
module.exports = router;
