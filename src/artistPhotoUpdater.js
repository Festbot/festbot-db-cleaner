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
			await sleep(100);

			console.log('Working on: ' + artistDoc.name);

			console.log('Downloading artist data from Spotify...');

			const newDoc = {
				...artistDoc
			};

			if (!artistDoc.artistPhoto || !artistDoc.genres) {
				await sleep(1000);

				const spotifyArtistData = await searchArtist(artistDoc.name, spotifyAccessToken);

				if (!artistDoc.genres) {
					newDocs.genres = spotifyArtistData.genres;
				}

				if (!artistDoc.artistPhoto) {
					console.log('Downloading image from Spotify...');
					const stream = await downloadStream(spotifyArtistData.images[0].url);

					console.log('Uploading image to the CDN...');
					const uuid = await uploadStream(stream);

					newDoc.artistPhoto = uuid;
					newDoc.hasPhoto = true;
				}
			}

			if (!artistDoc.popularity) {
				newDoc.popularity = -1;
			}

			if (artistDoc.featured) {
				newDoc.featured = false;
			}

			console.log('Updating artist entry...');
			await updateDocument('artists', newDoc);

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
