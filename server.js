var express = require('express');
var app = express();


var CercaniasCtrl = require('./controllers/cercanias');

// Allow CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/zones', CercaniasCtrl.getZones);

app.get('/zone/:zoneId/stations', CercaniasCtrl.getStations);

app.get('/zone/:zoneId/trip/from/:origin/to/:destination', CercaniasCtrl.getTrip);


var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Cercanias API listening on " + port);
});
