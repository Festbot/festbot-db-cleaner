const express = require('express');
const ArtistPhotoUpdater = require('./artistPhotoUpdater');
const EventPhotoUpdater = require('./eventPhotoUpdater');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	return res.send(JSON.stringify({ yay: 'it works' }));
});

app.get('/update-artist-photos', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	if (ArtistPhotoUpdater.getStatus().isInProgress) {
		return res.send(JSON.stringify({ isInProgress: true }));
	}

	ArtistPhotoUpdater.updateArtistPhotos();

	return res.send(JSON.stringify({ started: true }));
});

app.get('/update-artist-photos/status', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	return res.send(JSON.stringify(ArtistPhotoUpdater.getStatus()));
});

app.get('/update-event-photos', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	if (EventPhotoUpdater.getStatus().isInProgress) {
		return res.send(JSON.stringify({ isInProgress: true }));
	}

	EventPhotoUpdater.updateEventPhotos();

	return res.send(JSON.stringify({ started: true }));
});

app.get('/update-event-photos/status', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	return res.send(JSON.stringify(EventPhotoUpdater.getStatus()));
});

app.listen(PORT, function() {
	console.log('DB cleaner is listening on port ' + PORT);
});

