const axios = require('axios');
const DB_HOST = 'https://api.festbot.com';

module.exports.getDocuments = async function(db) {
	const { data } = await axios.get(DB_HOST + '/' + db + '/_all_docs?include_docs=true');
	return data.rows;
};
