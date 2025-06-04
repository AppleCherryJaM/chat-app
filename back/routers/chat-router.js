const {Router} = require('express');

const chatController = require('../controllers/chat-controller');

const router = new Router();

router.post('/new', chatController.createChat);

router.get("/:userId/:searchQuery", chatController.searchChat);
router.get("/:userId", chatController.getUserChats);
router.delete('/:chatId', chatController.deleteChat);
router.patch('/:chatId', chatController.updateChat);

module.exports = router;
