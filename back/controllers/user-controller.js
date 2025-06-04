const path = require("path");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const ApiError = require("../models/api-error");
const userSchema = require("../models/user");
const chatSchema = require("../models/chat");

const { getAuthorsList } = require("../services/quotable-service");
const { getRandomInt } = require("../utils/utils");

class UserController {
	async signup(req, res, next) {
		const {firstName, lastName, email, password} = req.body;
		//const image = req.file.image;
		let newUser, userChats;

		//const errors = validationResult(req);

		// let file;
		// try {
		// 	const candidate = userSchema.findOne({email: email, firstName: firstName, lastName: lastName});
		// 	// console.log("Candidate: ", candidate);
		// 	// if (candidate) {
		// 	// 	throw ApiError.UniquenessError({model: "User", field: "email", name: email})
		// 	// }
		// 	// if (!errors.isEmpty()) {
		// 	// 	return next();
		// 	// }

		// } catch (error) {
		// 	console.log(`Error in user-controller. Error: ${error}`)
		// 	return next(error);
		// }

		// saving users avatar picture path here
		// if (image) {
		// 	image.filename = uuid.v4() + ".jpg";
		// 	file = image.filename;
		// 	image.mv(path.resolve(
		// 		__dirname, "..", 'static', file
		// 	));
		// }

		try {
			const authors = await getAuthorsList();

			if (authors.isEmpty()) {
				throw ApiError.BadAPIRequest("Cannot get authors from API")
			}

			const indexes = [getRandomInt(0, 10), getRandomInt(10, 20), getRandomInt(20,30)];
			userChats = [
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[0]].name.split(" ")[0],
					lastName: authors[indexes[0]].name.split(" ")[1],
					constantName: authors[indexes[0]].slug
				}),
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[1]].name.split(" ")[0],
					lastName: authors[indexes[1]].name.split(" ")[1],
					constantName: authors[indexes[1]].slug
				}),
				new chatSchema({
					user: newUser._id,
					firstName: authors[indexes[2]].name.split(" ")[0],
					lastName: authors[indexes[2]].name.split(" ")[1],
					constantName: authors[indexes[2]].slug
				})
			];
			await insertMany();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		const hashPassword = await bcrypt.hash(password, 3);

		let chatIds = [];
		userChats.forEach((chat) => {
			chatIds.push(chat._id);
		});

		try {
			newUser = new userSchema({
				firstName,
				lastName,
				email,
				password: hashPassword,
				chats: chatIds
			});	
			await newUser.save();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		return res.status(201).json({ message: "User created", newUser });
	}

	async signin(req, res, next) {
		const { email, password } = req.body;
		let user;
		try {
			user = await userSchema.find({email});
			if (!user) {
				throw ApiError.SearchError({ model: "User", name: "email", value: email});
			}

			const isValidPassword = bcrypt.compareSync(password, user.password);
			if (!isValidPassword) {
				throw new ApiError(
					400, `Invalid password`
				);
			}

		} catch (error) {
			console.log(error);
			return next(error);
		}

		return res.status(200).json({result: user});
	}

	async logout(req, res, next) {

	}

	async deleteUser(req, res, next) {
		const {userId} = req.params;
		let deletedUser;
		try {
			deletedUser = await userSchema.deleteOne({_id: userId});
			return res.json({ result: deletedUser.toObject({ getters: true }) })
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}
}

module.exports = new UserController();