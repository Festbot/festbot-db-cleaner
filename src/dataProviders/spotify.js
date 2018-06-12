const axios = require('axios');
const request = require('request-promise');
const CLIENT_ID = 'a9e2d9e4fbd845e3ac54b4ab24c6a44d';
const CLIENT_SECRET = '56318a6ca19f4bbd85c66c81a36c5cca';
const AUTH_CODE = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

module.exports.getAccessToken = async function() {
	const response = await request.post({
		url: 'https://accounts.spotify.com/api/token',
		form: {
			grant_type: 'client_credentials'
		},
		headers: {
			Authorization: 'Basic ' + AUTH_CODE
		}
	});

	return JSON.parse(response).access_token;
};

module.exports.searchArtist = async function(artist, token) {
	const { data } = await axios({
		url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	if (data.artists.items.length === 0) {
		throw new Error("Couldn't find artist.");
	}

	return data.artists.items[0];
};
