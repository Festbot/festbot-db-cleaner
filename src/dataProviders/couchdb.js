const axios = require('axios');
const DB_HOST = 'https://api.festbot.com';

module.exports.createDocument = async function(db, data) {
	return await axios({
		url: DB_HOST + '/' + db,
		method: 'post',
		headers: { 'Content-Yype': 'application/json' },
		data: data
	});
};

module.exports.getDocuments = async function(db) {
	const { data } = await axios.get(DB_HOST + '/' + db + '/_all_docs?include_docs=true');
	return data.rows;
};

module.exports.updateDocument = async function(db, data) {
	return await axios({
		url: DB_HOST + '/' + db + '/' + data._id,
		method: 'put',
		headers: { 'If-Match': data._rev },
		data: data
	});
};

module.exports.findDocument = async function(db, field, keyword) {
	const { data } = await axios({
		url: DB_HOST + '/' + db + '/_find',
		method: 'post',
		headers: { 'Content-Yype': 'application/json' },
		data: {
			selector: {
				[field]: keyword
			}
		}
	});

	return data.docs;
};
