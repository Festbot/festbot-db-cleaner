const axios = require('axios');

module.exports.downloadStream = async function(url) {
	const response = await axios({
		url : url,
		method: 'GET',
		responseType: 'stream'
	});

	return response;
}
