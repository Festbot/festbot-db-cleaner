const axios = require('axios');

module.exports.downloadStream = async function(url) {
	const { data } = await axios({
		url: url,
		method: 'GET',
		responseType: 'stream'
	});

	return data;
};
