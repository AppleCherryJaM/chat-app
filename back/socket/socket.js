const userSchema = require("../models/user");
const chatSchema = require("../models/chat");
const messageSchema = require("../models/message");

const axios = require("axios");
const https = require("https");

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

		socket.on("update_chat", async ({ firstName, lastName, chatId }) => {
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
				messageText: text, chat: chatId, user: userId, type: 'sent'
			});

			try {
				await newMessage.save();
			} catch (error) {
				console.log(error);
			}

			const newChat = await chatSchema.findByIdAndUpdate(chat._id, {
				$push: { messages: newMessage._id },
			}).populate('messages');

			newChat.messages.push(newMessage);
			socket.emit('update_chat', newChat);

			setTimeout(async () => {
				const httpsAgent = new https.Agent({
					rejectUnauthorized: false,
				});

				const quoteRes = await axios.get('https://api.quotable.io/random', {
					httpsAgent,
				});
				const quote = quoteRes.data.content;
				console.log(quote);

				const autoMessage = await messageSchema.create({
					chat: chat._id,
					messageText: quote,
					type: 'received'
				});

				const updatedChat = await chatSchema.findByIdAndUpdate(chat._id, {
					$push: { messages: autoMessage._id },
				}).populate('messages');
				
				console.log("UpdatedChat: ", updatedChat);

				const autoResponse = {
					id: autoMessage._id,
					chatId: chat._id,
					messageText: autoMessage.messageText,
					timestamp: autoMessage.timestamp
				};

				io.emit('new_message', autoResponse);
				updatedChat.messages.push(autoResponse);
				socket.emit('update_chat', updatedChat)
			}, 3000);

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
