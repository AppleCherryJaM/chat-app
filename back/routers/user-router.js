const {Router} = require("express");
const {body} = require("express-validator");

const userController = require("../controllers/user-controller");

const router = new Router();

router.post("/registration",
	body("email").isEmail(),
	body("password").isLength({min: 4, max: 16}),
	userController.registration);

router.post("/signin", 
	body("email").isEmail(),
	body("password").isLength({ min: 4, max: 16 }), 
	userController.signin);

router.delete("/delete/:uid", userController.deleteUser);

router.get("/all", userController.getUsers)


module.exports = router;