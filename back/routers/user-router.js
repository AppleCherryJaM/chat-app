const {Router} = require("express");

const userController = require("../controllers/user-controller");

const router = new Router();

router.post("/registration",
	userController.registration);

router.post("/signin",  
	userController.signin);

router.delete("/delete/:userId", userController.deleteUser);

router.get("/all", userController.getUsers)


module.exports = router;