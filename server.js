var express = require('express');
var renfe = require('./renfe-scraper');

var app = express();

app.get('/zones', function(req, res){
	res.json(renfe.zones);
});

app.get('/zone/:zoneId/stations', function(req, res) {
	renfe.getStations(req.params.zoneId, function(stations) {
		res.json(stations);
	});
});

app.get('/zone/:zoneId/trip/from/:origin/to/:destination', function(req, res) {
	var tripReq = {
			zone: req.params.zoneId,
			origin: req.params.origin,
			destination: req.params.destination,
			date: req.query.date
	};
	renfe.getTrip(tripReq, function(routes) {
		res.json(routes);
	});
});

app.listen(3000);
