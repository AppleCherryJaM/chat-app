const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: 'string', required: true },
	lastName: { type: 'string', required: true },
	email: { type: 'string', required: true, unique: true },
	password: { type: 'string', required: true, minlength: 5 },
	avatar: {type: 'string'},
	chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }]
});

module.exports = mongoose.model('User', userSchema);