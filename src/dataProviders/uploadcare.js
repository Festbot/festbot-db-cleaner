const request = require('request-promise');

module.exports.uploadStream = async function(stream) {
	const formData = {
		UPLOADCARE_PUB_KEY: 'f901eb6f977e50e57615',
		UPLOADCARE_STORE: '1',
		file: [stream]
	};

	const response = await request.post({
		url: 'https://upload.uploadcare.com/base/',
		formData: formData
	});

	return JSON.parse(response).file;
};
