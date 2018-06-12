const { getDocuments, updateDocument } = require('./dataProviders/couchdb.js');
const { searchArtist, getAccessToken } = require('./dataProviders/spotify.js');
const { downloadStream } = require('./dataProviders/imageDownload.js');
const { uploadStream } = require('./dataProviders/uploadcare.js');

var isInProgress = false;
var error = null;
var itemsToUpdate = 0;
var couldntFindPhoto = [];
var itemsProcessed = 0;
var itemsUpdated = 0;
var isFinished = false;

const sleep = timeout =>
	new Promise(resolve => {
		setTimeout(resolve, timeout);
	});

const updateArtistPhotos = async function() {
	isInProgress = true;
	error = null;
	itemsToUpdate = 0;
	couldntFindPhoto = [];
	itemsProcessed = 0;
	itemsUpdated = 0;
	isFinished = false;

	console.log('Retrieving access token from Soptify...');
	const spotifyAccessToken = await getAccessToken();

	console.log('Downloading artists...');
	const artists = await getDocuments('artists');
	const artistsWithoutPhoto = artists.filter(artist => !artist.doc.artistPhoto && artist.doc.name);

	itemsToUpdate = artistsWithoutPhoto.length;

	for (let i = 0; i < artistsWithoutPhoto.length; i++) {
		const artistDoc = artistsWithoutPhoto[i].doc;
		itemsProcessed++;

		try {
			console.log('Working on: ' + artistDoc.name);

			console.log('Downloading artist data from Spotify...');
			//const spotifyArtistData = await searchArtist(artistDoc.name, spotifyAccessToken);

			console.log('Downloading image from Spotify...');
			//const stream = await downloadStream(spotifyArtistData.images[0].url);

			console.log('Uploading image to the CDN...');
			//const uuid = await uploadStream(stream);

			console.log('Updating artist entry with the new image. UUID:', uuid);
			//await updateDocument('artists', { ...artistDoc, artistPhoto: uuid, hasPhoto: true });

			itemsUpdated++;

			await sleep(1000);
		} catch (e) {
			couldntFindPhoto.push(artistDoc.name);
		}
	}

	console.log('Done.');
	isInProgress = false;
	isFinished = true;
};

const getStatus = function() {
	return {
		isInProgress,
		error,
		itemsToUpdate,
		couldFindPhoto,
		itemsProcessed,
		itemsUpdated,
		isFinished
	};
};

module.exports = { updateArtistPhotos, getStatus };
