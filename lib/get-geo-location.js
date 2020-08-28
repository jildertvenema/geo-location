"use strict";

var _require = require('./intersection.js'),
    intersection = _require.intersection;

var ROUND_DECIMAL = 6;
var POSITION_MATCH_MARGIN_METERS = 2;

function measure(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM

  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

var posEqual = function posEqual(p1, p2) {
  return measure(p1[0], p1[1], p2[0], p2[1]) <= POSITION_MATCH_MARGIN_METERS;
};

var round = function round(n) {
  return Number(n.toFixed(ROUND_DECIMAL));
};

var getGeoLocation = function getGeoLocation(measurements, endpoints) {
  var routerPositions = [];
  var endpointNames = endpoints.map(function (e) {
    return e.endpoint;
  });
  endpointNames.forEach(function (bestname) {
    var currentMeasurements = measurements.filter(function (m) {
      return m.endpoint == bestname;
    });
    var inters = [];

    var addPoint = function addPoint(_long, lat) {
      var x = _long ? round(_long) : null;
      var y = lat ? round(lat) : null;

      if (isNaN(x) || isNaN(y)) {} else {
        var found = inters.find(function (inte) {
          return posEqual(inte.position, [x, y]);
        });

        if (!found) {
          inters.push({
            position: [x, y],
            count: 1
          });
        } else {
          found.count += 1;
        }
      }
    };

    currentMeasurements.forEach(function (m1) {
      currentMeasurements.forEach(function (m2) {
        if (m1 != m2) {
          var points = intersection(m1.position, m1.distance, m2.position, m2.distance);
          addPoint(points[0], points[2]);
          addPoint(points[1], points[3]);
        }
      });
    });
    var best = inters[0];
    inters.forEach(function (inters) {
      if (inters.count > best.count) {
        best = inters;
      }
    });
    var routerPosition = best.position;
    routerPositions.push({
      endpoint: bestname,
      position: routerPosition
    });
  });
  var myIntercections = [];
  routerPositions.forEach(function (r) {
    routerPositions.forEach(function (r2) {
      if (r !== r2) {
        var rbest = endpoints.find(function (b) {
          return b.endpoint === r.endpoint;
        }).distance;
        var r2best = endpoints.find(function (b) {
          return b.endpoint === r2.endpoint;
        }).distance;
        var inters = intersection(r.position, rbest, r2.position, r2best);
        var x = inters[0] ? round(inters[0]) : null;
        var y = inters[2] ? round(inters[2]) : null;

        if (isNaN(x) || isNaN(y)) {} else {
          var found = myIntercections.find(function (inte) {
            return posEqual(inte.position, [x, y]);
          });

          if (!found) {
            myIntercections.push({
              position: [x, y],
              count: 1
            });
          } else {
            found.count += 1;
          }
        }
      }
    });
  });
  var mybest = myIntercections[0];
  myIntercections.forEach(function (inters) {
    if (inters.count > mybest.count) {
      mybest = inters;
    }
  });
  return mybest.position;
};

module.exports = {
  getGeoLocation: getGeoLocation
};