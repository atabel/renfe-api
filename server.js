var express = require('express');
var moment = require('moment-timezone');
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
        date: req.query.date || moment().tz('Europe/Madrid').format('YYYYMMDD')
    };
    renfe.getTrip(tripReq, function(routes) {
        res.json(routes);
    });
});

app.get('/time', function(req, res) {
    var date = new Date();
    res.json({
        date: date,
        env: process.env.TZ,
        today: moment().tz('Europe/Madrid').format('YYYYMMDD HH:mm')
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
