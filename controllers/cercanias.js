var moment = require('moment-timezone');
var renfe = require('../renfe-scraper');


exports.getTrip = function(req, res) {
    var tripReq = {
        zone: req.params.zoneId,
        origin: req.params.origin,
        destination: req.params.destination,
        date: req.query.date || moment().tz('Europe/Madrid').format('YYYYMMDD')
    };
    renfe.getTrip(tripReq, function(routes) {
        res.json(routes);
    });
};

exports.getStations = function(req, res) {
    renfe.getStations(req.params.zoneId, function(stations) {
        res.json(stations);
    });
};

exports.getZones = function(req, res){
    res.json(renfe.zones);
};