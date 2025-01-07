const express = require("express");
const router = express.Router();

const controller = require("../controller/controllerAuth");

router.post("/register", controller.userRegister);
router.post("/login", controller.loginUser);
router.get("/logout", controller.processLogout);

module.exports = router;
