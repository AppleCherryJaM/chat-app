const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const chatSchema = new Schema({
	user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
	firstName: { type: String },
	lastName: { type: String },
	avatar: {type: String, default: "random-string"},
	createdAt: { type: Date, default: Date.now },
	messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }]
});

module.exports = model("Chat", chatSchema);