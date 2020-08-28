"use strict";

var _require = require('./test-data'),
    endpoints = _require.endpoints;

var _require2 = require('..//get-geo-location'),
    getGeoLocation = _require2.getGeoLocation;

var measurements = [];
var testPost = [53.249661, 6.152776];
var DEVIATION_PERCENTAGE = 1;

var getDistance = function getDistance(p1, p2) {
  var diffx = Math.abs(p1[0] - p2[0]);
  var diffy = Math.abs(p1[1] - p2[1]); // also distance

  var radius = Math.sqrt(diffx * diffx + diffy * diffy);
  return radius;
};

var getDeviation = function getDeviation(n) {
  var percentage = 100 - Math.floor(Math.random() * DEVIATION_PERCENTAGE * 100) / 100;
  return n / 100 * percentage;
};

var messure = function messure(x1, x2, xstep, y1, y2, ystep) {
  var _loop = function _loop(x) {
    var _loop2 = function _loop2(y) {
      endpoints.forEach(function (measurement) {
        // also distance
        // Small deviation calculation with a percentage
        var radius = getDeviation(getDistance(measurement.position, [x, y]));
        measurements.push({
          endpoint: measurement.endpoint,
          distance: radius,
          position: [x, y]
        });
      });
    };

    for (var y = y1; y <= y2; y += ystep) {
      _loop2(y);
    }
  };

  for (var x = x1; x <= x2; x += xstep) {
    _loop(x);
  }
};

messure(53.251377, 53.251902, 0.0001, 6.154783, 6.154979, 0.00005);
messure(53.250846, 53.251377, 0.0001, 6.153339, 6.154979, 0.00005);
var testMeasurements = [];
endpoints.forEach(function (endpoint) {
  var distance = getDistance(endpoint.position, testPost);
  testMeasurements.push({
    endpoint: endpoint.endpoint,
    distance: distance
  });
});
var best3 = testMeasurements.sort(function (a, b) {
  return a.distance - b.distance;
}).slice(0, 3);
var result = getGeoLocation(measurements, best3);
console.log('Calculated position: ', result);
console.log('Actual position: ', testPost);