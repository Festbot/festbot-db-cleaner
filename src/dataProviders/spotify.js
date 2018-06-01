const axios = require('axios');
const TOKEN = 'BQCsCxT1_r5fIsVZWu-tMSDk2nED79QnssThkj-2EQqt7JeU1QTT-1ssDRv6JhDKubiP8an1VSERbq5pjzvWRVE5o61lxFJDg13iHV--baOM6KLtTQnNRyDabKs_Fh_D9_A3oi3fyJcqZkS8hkP1VXQmZifTuYPuy_Z8PCP1AggK_Z6XVA';

module.exports.searchArtist = async function(artist) {
	const { data } = await axios({
		url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
		method: 'get',
		headers: {
			Authorization:
				'Bearer ' + TOKEN
		}
	});

	return data.artists.items[0];
};
