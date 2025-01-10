const express = require("express");
const router = express.Router();

const controller = require("../controller/controllerRenderPage");

router.get("/", controller.renderHome);
router.get("/my-project", controller.renderMyProject);
router.get("/add-project", controller.renderAddProject);
router.get("/edit-project/:id", controller.renderEditProject);
router.get("/detail-project/:id", controller.renderDetailProject);

router.get("/testimonial", controller.renderTestimonials);
router.get("/contact", controller.renderContact);

router.get("/login", controller.renderLogin);
router.get("/register", controller.renderRegister);

router.get("*", controller.renderNotFound);

module.exports = router;
