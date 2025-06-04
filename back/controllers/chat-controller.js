const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");
const { searchAuthor } = require("../services/quotable-service");

const chatSchema = require("../models/chat");
const userSchema = require("../models/user");
const messageSchema = require("../models/message");
const ApiError = require("../models/api-error");

const { getRandomInt } = require("../utils/utils");

class ChatController {
	async createChat(req, res, next) {
		const {firstName, lastName, userId} = req.body;
		const errors = validationResult(req);
		let authors, constantName, newChat, user;

		// проверка на наличие юзера
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

		// поиск автора по введённым пользователем имени/фамилии
		try {
			let query;
			if (!errors.isEmpty()) {
				return next();
			}

			if (firstName) query = firstName;
			if (lastName) query += ` ${lastName}`;

			authors = await searchAuthor(query).results;
			constantName = authors[getRandomInt(0, 100)].slug;
		} catch (error) {
			return next(error);
		}

		// создание нового чата
		try {
			newChat = new chatSchema({
				user: userId, firstName, lastName, constantName
			})

			let isChatExists = false;
			user.chats.forEach((constantName) => isChatExists = constantName === newChat.constantName); // проверка на существование чата
			
			if (isChatExists) {
				throw ApiError.UniquenessError({ model: "ChatSchema", field: "constantName", value: constantName });
			}
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
		const {userId, searchQuery} = req.params;
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
					{constantName: {$regex: searchQuery, $options: "i"}}
				]
			});

			// if (!searchResults.isEmpty()) {
			// 	res.json({ results: searchResults.toObject({ getters: true }) });
			// } else {
			// 	res.json()
			// }
			return res.status(200).json({ results: searchResults.toObject({ getters: true }) });

		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async getUserChats(req, res, next) {
		const { userId } = req.params.uid;
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
			userChats = await chatSchema.select('_id name constantName messages').where('_id').in(user.chats).exec();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({ chats: userChats });
	}

	async updateChat(req, res, next) {
		const { firstName, lastName } = req.body;
		const chatId = req.params.cid;

		let updatedChat;
		try {
			updatedChat = await chatSchema.findById(chatId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!updatedChat) {
			return next(
				ApiError.searchError({ model: 'chat', name: 'id', value: chatId })
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
		const chatId = req.params.cid;
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
		const {chatId} = req.params.cid
		let chat, user;
		try {
			chat = await chatSchema.findById(chatId);
			if (!chat) {
				return next(
					ApiError.SearchError({ model: 'chat', name: 'id', value: chatId })
				)
			}
		} catch (error) {
			console.log(error);
			return next(error);
		}

		try {
			user = userSchema.findById(chat.user);
			if (!user) {
				throw ApiError.SearchError({model: "User", name: "id", value: chat.user});
			}
		} catch (error) {
			console.log(error);
			return next(error);
		}

		try {
			const session = mongoose.startSession();
			session.startTransaction();
			await messageSchema.deleteMany({ chat: chatId });
			await chat.deleteOne({ session: session });

			const index = user.chats.indexOf(chat._id);
			user.chats.splice(index, 1);

			await chat.user.save({ session });
			await session.commitTransaction();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		return res.status(200).json({ message: "Chat has been deleted" });
	}
}

module.exports = new ChatController();