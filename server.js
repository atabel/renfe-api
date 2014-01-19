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

var twoDigits = function(num) {
    return num < 10 ? '0' + num : num;
};

var today = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = twoDigits(now.getMonth() + 1);
    var day = twoDigits(now.getDate());

    return '' + year + month + day;
};

app.get('/zone/:zoneId/trip/from/:origin/to/:destination', function(req, res) {
    var tripReq = {
        zone: req.params.zoneId,
        origin: req.params.origin,
        destination: req.params.destination,
        date: req.query.date || today()
    };
    renfe.getTrip(tripReq, function(routes) {
        res.json(routes);
    });
});

app.get('/time', function(req, res) {
    var date = new Date();
    res.json({today: date});
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
