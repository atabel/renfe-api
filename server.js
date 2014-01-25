var express = require('express');
var moment = require('moment-timezone');
var renfe = require('./renfe-scraper');

var app = express();

// Allow CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

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


var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
