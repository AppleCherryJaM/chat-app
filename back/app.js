require("dotenv").config();
const http = require("http");
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const mainRouter = require("./routers/main-router");

const PORT = process.env.PORT;

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", mainRouter)

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL);
		server.listen(PORT, () => {
			console.log("Server started");
		});
	} catch (error) {
		console.log(error);
	}
}

start();