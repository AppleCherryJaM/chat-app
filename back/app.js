const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");

const mainRouter = require("./routers/main-router");
const handler = require('./socket/socket');

const PORT = process.env.PORT || 5000;
const IO_PORT =process.env.IO_PORT;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'static'));
app.use(fileUpload({}));
app.use(cookieParser());
app.use(cors());

app.use("/api", mainRouter);

const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: "*", methods: ['GET', 'POST'] }
});

handler(io);

const start = async () => {
	try {
		await mongoose.connect(DB_URL);
		io.listen(IO_PORT);
		server.listen(PORT, () => {
			console.log("Server started");
		});
	} catch (error) {
		console.log(error);
	}
}

start();