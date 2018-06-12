const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { updateArtistPhotos, getStatus } = require('./artistPhotoUpdater');

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	return res.send(JSON.stringify({ yay : 'it works' }));
});

app.get('/update-artist-photos', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	if (getStatus().isInProgress) {
		return res.send(JSON.stringify({ isInProgress: true }));
	}

	updateArtistPhotos();

	return res.send(JSON.stringify({ started: true }));
});

app.get('/update-artist-photos/status', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	return res.send(JSON.stringify(getStatus()));
});

app.listen(PORT, function() {
	console.log('DB cleaner is listening on port ' + PORT);
});
