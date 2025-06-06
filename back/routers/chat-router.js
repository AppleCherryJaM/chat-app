const {Router} = require('express');

const chatController = require('../controllers/chat-controller');

const router = new Router();

router.post('/new', chatController.createChat);
router.post("/search", chatController.searchChat);

router.get("/:userId", chatController.getUserChats);
router.get("/history/:chatId", chatController.getChatHistory);

router.delete('/delete/:chatId', chatController.deleteChat);
router.patch('/edit/:chatId', chatController.updateChat);

module.exports = router;
