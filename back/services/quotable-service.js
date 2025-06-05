const axios = require("axios");
const https = require("https");

const API_URL = process.env.QUOTABLE_API;

const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

const searchAuthor = async (query) => {
	const author = await axios.get(`${API_URL}/search/authors?query=${query}`); //returning array
	return author;
}

const getRandomQuote = async () => {
	const result = await axios.get(`${API_URL}/quotes/random`);
	return result;
}

const getAuthorsList = async () => {
	let result;
	const response = await axios.get(`${API_URL}/authors?sortBy=name`, { httpsAgent });
	result = response.data.results;
	return result;
}

const searchAuthorsQuotes = async (query) => {
	const result = await axios.get(`${API_URL}/search/quotes?query=${query}&fields=author`);
	return result;
}

module.exports = { searchAuthor, searchAuthorsQuotes, getRandomQuote, getAuthorsList };