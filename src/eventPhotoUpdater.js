const { getDocuments, updateDocument, findDocument } = require('./dataProviders/couchdb.js');

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

const updateEventPhotos = async function() {
	isInProgress = true;
	error = null;
	itemsToUpdate = 0;
	couldntFindPhoto = [];
	itemsProcessed = 0;
	itemsUpdated = 0;
	isFinished = false;

	console.log('Downloading events...');
	const events = await getDocuments('events');
	const eventsWithoutPhoto = events.filter(event => !event.doc.artistPhoto && event.doc.artist);

	itemsToUpdate = eventsWithoutPhoto.length;

	for (let i = 0; i < eventsWithoutPhoto.length; i++) {
		const eventDoc = eventsWithoutPhoto[i].doc;
		itemsProcessed++;

		try {
			await sleep(100);

			console.log('Working on: ' + eventDoc.artist);

			const [artistDoc] = await findDocument('artists', 'name', eventDoc.artist);

			if (artistDoc.hasPhoto) {
				await updateDocument('events', { ...eventDoc, artistPhoto: artistDoc.artistPhoto, hasPhoto: true });
			} else {
				throw new Error(artistDoc.name + " didn't have a photo.");
			}

			console.log('Updating event entry with the new image.');

			itemsUpdated++;
		} catch (e) {
			console.log(e);
			couldntFindPhoto.push(eventDoc.artist);
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

module.exports = { updateEventPhotos, getStatus };
