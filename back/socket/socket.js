const userSchema = require("../models/user");
const chatSchema = require("../models/chat");
const messageSchema = require("../models/message");

const ApiError = require("../models/api-error");
const { getAuthorsList, getRandomQuote } = require("../services/quotable-service");

module.exports = function (io) {
	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		socket.on('chat_create', async (firstName, lastName) => {
			try {
				console.log('Created new chat', firstName, lastName);
				socket.emit('chat_create_success', firstName, lastName);
			} catch (error) {
				console.error(error);
				socket.emit('error', { message: 'Failed to fetch user data' });
			}
		});

		socket.on("chat_update", async ({ firstName, lastName, chatId }) => {
			let updatedChat;
			try {
				updatedChat = chatSchema.findById(chatId);

				if (!updatedChat) throw ApiError.SearchError({ model: "Chat", name: "id", value: chatId });
				updatedChat.firstName = firstName;
				updatedChat.lastName = lastName;
				await updatedChat.save();
			} catch (error) {
				console.log(error);
			}
		});

		socket.on("message_send", async({userId, chatId, text}) => {
			let chat;
			try {
				const user = await userSchema.findById(userId);
				chat = await chatSchema.findById(chatId);
				if (!user && !chat) {
					throw ApiError.SearchError("Cannot find chat or user in socket.js");
				}
			} catch (error) {
				console.log(error);
			}
			const newMessage = new messageSchema({
				messageText: text, chat: chatId, user: userId
			});

			try {
				await newMessage.save();
			} catch (error) {
				console.log(error);
			}

			let apiResponse, apiMessage;

			try {
				apiResponse = await getRandomQuote().content;
				apiMessage = new messageSchema({
					messageText: apiResponse,
					chat: chatId
				});
				await apiMessage.save();
			} catch (error) {
				console.log(error);
			}

			socket.emit('api_response', apiMessage);

		});

		socket.on('message_edit', async ({newText, messageId}) => {
			let updatedMessage;
			try {
				updatedMessage = await messageSchema.findById(messageId);

				if (!updatedMessage) throw ApiError.SearchError({model: "Message", name: "id", value: messageId});

				updatedMessage.messageText = newText;
				await updatedMessage.save();
			} catch (error) {
				console.log(error);	
			}
		});

		socket.on("message_delete", async ({messageId}) => {
			let deletedMessage;
			try {
				deletedMessage = messageSchema.findById(messageId);

				if (!deletedMessage) throw ApiError.SearchError({ model: "Message", name: "id", value: messageId });
				await deletedMessage.delete();

			} catch (error) {
				console.log(error);	
			}
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});
};
