const path = require("path");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const ApiError = require("../models/api-error");
const userSchema = require("../models/user");
const chatSchema = require("../models/chat");

const { getAuthorsList } = require("../services/quotable-service");
const { getRandomInt } = require("../utils/utils");

class UserController {
	async registration(req, res, next) {
		const {firstName, lastName, email, password} = req.body;
		console.log(req.body);
		const image = req.files ? req.files.image : undefined;
		let newUser, userChats;

		let file, candidate;
		try {
			candidate = await userSchema.findOne({email: email});
		} catch (error) {
			console.log(`Error in user-controller. Error: ${error}`)
			return next(error);
		}

		if (candidate) {
			return next(ApiError.UniquenessError({ model: "User", field: "email", name: email }));
		}

		// saving users avatar picture path here
		if (image) {
			image.filename = uuid.v4() + ".jpg";
			file = image.filename;
			image.mv(path.resolve(
				__dirname, "..", 'static', file
			));
		}

		const hashPassword = await bcrypt.hash(password, 3);

		newUser = new userSchema({
			firstName: firstName,
			lastName,
			email,
			avatar: file,
			password: hashPassword
		});	

		try {
			const authors = await getAuthorsList();

			if (!authors && authors.length < 0) {
				return next(ApiError.BadAPIRequest("Cannot get authors from API"));
			}

			const indexes = [getRandomInt(0, 20), getRandomInt(0, 20), getRandomInt(0,20)];
			userChats = [
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[0]].name.split(" ")[0],
					lastName: authors[indexes[0]].name.split(" ")[1],
					avatar: "default-chat-picture1.jpg"
				}),
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[1]].name.split(" ")[0],
					lastName: authors[indexes[1]].name.split(" ")[1],
					avatar: "default-chat-picture1.jpg"
				}),
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[2]].name.split(" ")[0],
					lastName: authors[indexes[2]].name.split(" ")[1],
					avatar: "default-chat-picture1.jpg"
				})
			];
			await chatSchema.insertMany(userChats);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		let chatIds = [];
		userChats.forEach((chat) => {
			chatIds.push(chat._id);
		});

		try {
			newUser.chats = chatIds;
			await newUser.save();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		newUser.chats = userChats;
		return res.status(201).json({ message: "User created", newUser });
	}

	async signin(req, res, next) {
		const { email, password } = req.body;
		console.log(email);
		let user;
		try {
			user = await userSchema.findOne({email});
			if (!user) {
				return next(ApiError.SearchError({ model: "User", name: "email", value: email }));
			}

			const isValidPassword = bcrypt.compareSync(password, user.password);
			console.log(isValidPassword)
			if (!isValidPassword) {
				return next(new ApiError(
					400, `Invalid password`
				));
			}

		} catch (error) {
			console.log(error);
			return next(error);
		}

		let chats;
		try {
			chats = await chatSchema.find({user: user._id}).populate('messages');
		} catch (error) {
			return next(error);
		}

		user.chats = chats;
		res.status(200).json({result: user});
	}

	async deleteUser(req, res, next) {
		const userId = req.params.userId;
		let deletedUser;
		try {
			deletedUser = await userSchema.deleteOne({_id: userId});
			return res.json({ result: deletedUser.toObject({ getters: true }) })
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async testMethod(req, res, next) {
		try {
			const result = await getAuthorsList();
			return res.json({result});
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async getUsers(req, res, next){
		let users;
		try {
			users = await userSchema.find();
		} catch (error) {
			return next(error);
		}
		return res.status(200).json({result: users});
	}
}

module.exports = new UserController();