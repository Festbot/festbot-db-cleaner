const { getDocuments, updateDocument } = require('./dataProviders/couchdb.js');
const { searchArtist, getAccessToken } = require('./dataProviders/spotify.js');
const { downloadStream } = require('./dataProviders/imageDownload.js');
const { uploadStream } = require('./dataProviders/uploadcare.js');
const chalk = require('chalk');

const sleep = timeout =>
	new Promise(resolve => {
		setTimeout(resolve, timeout);
	});

(async function() {
	console.log(chalk.green('Retrieving access token from Soptify...'));
	const spotifyAccessToken = await getAccessToken();

	console.log(chalk.green('Downloading artists...'));
	const artists = await getDocuments('artists');
	const artistsWithoutPhoto = artists.filter(artist => !artist.doc.artistPhoto && artist.doc.name);

	for (let i = 0; i < artistsWithoutPhoto.length; i++) {
		try {
			const artistDoc = artistsWithoutPhoto[i].doc;
			console.log(chalk.cyan('Working on: ' + artistDoc.name));

			console.log(chalk.green('Downloading artist data from Spotify...'));
			const spotifyArtistData = await searchArtist(artistDoc.name, spotifyAccessToken);

			console.log(chalk.green('Downloading image from Spotify...'));
			const stream = await downloadStream(spotifyArtistData.images[0].url);

			console.log(chalk.green('Uploading image to the CDN...'));
			const uuid = await uploadStream(stream);

			console.log(chalk.green('Updating artist entry with the new image. UUID:'), uuid);
			await updateDocument('artists', { ...artistDoc, artistPhoto: uuid, hasPhoto: true });

			await sleep(1000);
		} catch (e) {
			console.log(chalk.red('Error'), e);
		}
	}

	console.log('Done.');
})();
