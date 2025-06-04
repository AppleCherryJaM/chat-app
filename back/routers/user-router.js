const {Router} = require("express");
const validator = require("express-validator");

const userController = require("../controllers/user-controller");

const router = new Router();

router.post("/signup", userController.signup);

router.get("/signin", userController.signin);


//router.delete("/:userId", userController);

module.exports = router;