const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
const { searchAuthor } = require("../services/quotable-service");

const chatSchema = require("../models/chat");
const userSchema = require("../models/user");
const messageSchema = require("../models/message");
const ApiError = require("../models/api-error");

class ChatController {
	async createChat(req, res, next) {
		const {firstName, lastName, userId} = req.body;
		const errors = validationResult(req);
		let newChat, user;

		try {
			user = await userSchema.findById(userId);

			if (!user) {
				throw ApiError.SearchError({
					model: "user", 
					name: 'id', 
					value: userId
				});
			}

		} catch (error) {
			console.log(error);
			return next(error)
		}

		try {
			let query;
			if (!errors.isEmpty()) {
				return next();
			}

			if (firstName) query = firstName;
			if (lastName) query += ` ${lastName}`;

		} catch (error) {
			return next(error);
		}

		try {
			newChat = new chatSchema({
				user: userId, firstName, lastName
			})
		} catch (error) {
			console.log(error);
			return next(error); 
		}

		try {
			const session = await mongoose.startSession();
			session.startTransaction();
			await newChat.save();
			user.chats.push(newChat);
			await user.save({session});
			await session.commitTransaction();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		return res.status(201).json({ isSuccess: true, message: "Chat successfully created", chat: newChat.toObject({ getters: true }) });
	}

	async searchChat(req, res, next) {
		const {userId, searchQuery} = req.body;
		console.log("Search: ", searchQuery);
		let user, searchResults;
		try {
			user = await userSchema.findById(userId);

			if (!user) throw ApiError.SearchError({model: "User", name: "id", value: userId});
		} catch (error) {
			console.log(error);
			return next(error);
		}

		try {
			searchResults = await chatSchema.find({
				$or: [
					{firstName: {$regex: searchQuery, $options: "i"}},
					{lastName: {$regex: searchQuery, $options: "i"}},
				]
			}).populate('messages');
			return res.status(200).json({ results: searchResults});

		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async getChatHistory(req, res, next) {
		const chatId = req.params.chatId;
		let messages = [];
		try {
			messages = await messageSchema.find({chat: chatId});
		} catch (error) {
			return next(error);
		}

		return res.status(200).json({result: messages});
	}

	async getUserChats(req, res, next) {
		const userId = req.params.userId;
		let user;
		try {
			user = await userSchema.findById(userId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!user) {
			return next(
				ApiError.SearchError({ model: "user", name: 'id', value: userId })
			)
		}

		let userChats;
		try {
			userChats = await chatSchema.find({ _id: { $in: user.chats } }).populate('messages');
			//userChats = await chatSchema.select('_id name messages').where('_id').in(user.chats).exec();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({ chats: userChats });
	}

	async updateChat(req, res, next) {
		const { firstName, lastName } = req.body;
		console.log(req.params);
		const chatId = req.params.chatId;

		let updatedChat;
		updatedChat = await chatSchema.findById(chatId);

		if (!updatedChat) {
			return next(
				ApiError.SearchError({ model: 'chat', name: 'id', value: chatId })
			);
		}

		if (firstName) updatedChat.firstName = firstName;
		if (lastName) updatedChat.lastName = lastName;

		try {
			await updatedChat.save();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		return res.status(200).json({ chat: updatedChat.toObject({ getters: true }) });
	}

	async clearChat(req, res, next) {
		const chatId = req.params.chatId;
		let chat;
		try {
			chat = await chatSchema.findById(chatId);
		} catch (error) {
			return next(error);
		}

		if (!chat) {
			return next(
				ApiError.SearchError({ model: 'chat', name: 'id', value: chatId })
			)
		}

		try {
			await messageSchema.deleteMany({ chat: chat._id });
		} catch (error) {
			console.log(error);
			return next(error);
		}

		return res.status(200).json({ message: "Chat has been cleared" });
	}

	async deleteChat(req, res, next) {
		const chatId = req.params.chatId;
		const chat = await chatSchema.findById(chatId);

		console.log("Chat: ", chat);
		const user = await userSchema.findById(chat.user);

		
		await messageSchema.deleteMany({ chat: chatId });
		await chat.deleteOne();

		const index = user.chats.indexOf(chat._id);
		user.chats.splice(index, 1);

		await user.save();

		return res.status(200).json({ message: "Chat has been deleted" });
	}
}

module.exports = new ChatController();