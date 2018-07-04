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
	itemsToUpdate = artists.length;

	for (let i = 0; i < itemsToUpdate; i++) {
		const artistDoc = artists[i].doc;
		itemsProcessed++;

		try {
			await sleep(1000);

			console.log('Working on: ' + artistDoc.name);

			console.log('Downloading artist data from Spotify...');
			const spotifyArtistData = await searchArtist(artistDoc.name, spotifyAccessToken);

			let uuid = undefined;

			if (!artistDoc.artistPhoto) {
				console.log('Downloading image from Spotify...');
				const stream = await downloadStream(spotifyArtistData.images[0].url);

				console.log('Uploading image to the CDN...');
				uuid = await uploadStream(stream);
			}

			console.log('Updating artist entry with the new image. UUID:', uuid);
			await updateDocument('artists', {
				...artistDoc,
				artistPhoto: uuid,
				hasPhoto: !!uuid,
				genres: spotifyArtistData.genres
			});

			itemsUpdated++;
		} catch (e) {
			console.log(e);
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
		couldntFindPhoto,
		itemsProcessed,
		itemsUpdated,
		isFinished
	};
};

module.exports = { updateArtistPhotos, getStatus };
