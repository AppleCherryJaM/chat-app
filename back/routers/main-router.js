const {Router} = require("express");

const chatRouter = require("./chat-router");
const userRouter = require("./user-router");

const router = new Router();

router.use("/chat", chatRouter);
router.use("/user", userRouter);

module.exports = router;
