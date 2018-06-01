const { getDocuments } = require('./dataProviders/couchdb.js');
const { searchArtist } = require('./dataProviders/spotify.js');
const { downloadStream } = require('./dataProviders/imageDownload.js');

(async function() {
	const artists = await getDocuments('artists');

	const artistsWithoutPhoto = artists.filter(artist => !artist.doc.artistPhoto);
	const artist = await searchArtist(artistsWithoutPhoto[10].doc.name);

	console.log(await downloadStream(artist.images[0].url));
})();
