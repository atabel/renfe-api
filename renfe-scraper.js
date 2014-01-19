var req = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv');

var BASE_TRIP_URL = 'http://horarios.renfe.com/cer/hjcer310.jsp?';
var BASE_STATIONS_URL = 'http://horarios.renfe.com/cer/hjcer300.jsp?CP=NO&I=s&NUCLEO=';
var ZONES = [
	{
		id: '20',
		name: 'Asturias'
	},
	{
		id: '50',
		name: 'Barcelona'
	},
	{
		id: '60',
		name: 'Bilbao'
	},
	{
		id: '31',
		name: 'Cádiz'
	},
	{
		id: '10',
		name: 'Madrid'
	},
	{
		id: '32',
		name: 'Málaga'
	},
	{
		id: '41',
		name: 'Múrcia/Alicante'
	},
	{
		id: '62',
		name: 'Santander'
	},
	{
		id: '61',
		name: 'San Sebastián'
	},
	{
		id: '30',
		name: 'Sevilla'
	},
	{
		id: '40',
		name: 'Valencia'
	},
	{
		id: '70',
		name: 'Zaragoza'
	}
];

var request = function(options, callback) {
	if (typeof options === 'string') {
		options = {url: options};
	}
	options.encoding = null;
	req(options, function(err, resp, body) {
		var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
		var buf = ic.convert(body);
		var utf8Body = buf.toString('utf-8');
		callback(err, resp, utf8Body);
	});
};


var parseTrip = function(body, callback) {
	var $ = cheerio.load(body);
	var rows = $('table tr');
	var routes = [];
	rows.each(function() {
		var cols = $(this).find('td');
		routes.push({
			'line': $(cols[0]).text().trim(),
			'start': $(cols[1]).text().trim(),
			'arrive': $(cols[2]).text().trim(),
			'time': $(cols[3]).text().trim()
		});
	});
	//remove the first 2 rows (the head of the table)
	callback(routes.slice(2));
};

var createTripRequest = function(trip) {
	return {
		'url': BASE_TRIP_URL,
		'qs': {
			nucleo: trip.zone,
			i: 's',
			cp: 'NO',
			o: trip.origin,
			d: trip.destination,
			df: trip.date,
			ho: trip.startHour || 0,
			hd: trip.endHour || 26,
			TXTInfo: ''
		}
	};
};

/**
 * Query Renfe servers for the routes between two stations
 * @param  {Object}   trip
 *         - zone: the Renfe zone id
 *         - origin: origin station
 *         - destination: destination station
 *         - date: the date of the trip
 *         - startHour: (optional) start hour from which search for trains
 *         - endHour: (optional) the last our to search
 *
 * @param  {Function} callback to be called with the result trips as argument
 */
var getTrip = function(trip, callback) {
	var tripReq = createTripRequest(trip);
	request(tripReq, function(err, resp, body) {
		parseTrip(body, callback);
	});
};

var parseStations = function(body, callback) {
	var $ = cheerio.load(body);
	var options = $('select[name=o]').find('option');
	var stations = [];
	options.each(function() {
		var opt = $(this);
		var val = opt.attr('value');
		if (val !== '?') {
			stations.push({
				'value': val,
				'name': opt.text().trim()
			});
		}
	});
	callback(stations);
};

/**
 * Query Renfe servers for the list of stations in a Cercanias Zone
 * @param  {Number}   zoneId
 * @param  {Function} callback to be called with the list of stations as argument
 */
var getStations = function(zoneId, callback) {
	request(BASE_STATIONS_URL + zoneId, function(err, resp, body) {
		parseStations(body, callback);
	});
};

module.exports = {
	zones: ZONES,
	getStations: getStations,
	getTrip: getTrip
};