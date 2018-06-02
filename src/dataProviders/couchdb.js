const axios = require('axios');
const DB_HOST = 'https://api.festbot.com';

module.exports.getDocuments = async function(db) {
	const { data } = await axios.get(DB_HOST + '/' + db + '/_all_docs?include_docs=true');
	return data.rows;
};

module.exports.updateDocument = async function(db, data) {
	return await axios({
		url: DB_HOST + '/' + db + '/' + data._id,
		method: 'put',
		headers: {'If-Match': data._rev},
		data: data
	});
};
