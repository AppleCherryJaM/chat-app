const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const chatSchema = new Schema({
	user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
	firstName: { type: String },
	lastName: { type: String },
	constantName: {type: String, required: true, unique: true},
	avatar: {type: String, required: true},
	messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }]
});

module.exports = model("Chat", chatSchema);