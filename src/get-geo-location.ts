
const { intersection } = require('./intersection.js')
import Measurement from '../types/measurement';
import Endpoint from '../types/endpoint';

const ROUND_DECIMAL = 6;
const POSITION_MATCH_MARGIN_METERS = 2 


function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

const posEqual = (p1, p2) => {
  return measure(p1[0], p1[1], p2[0], p2[1]) <= POSITION_MATCH_MARGIN_METERS;
}
const round = (n) => Number(n.toFixed(ROUND_DECIMAL))

const getGeoLocation = (measurements: Array<Measurement>, endpoints: Array<Endpoint>): Array<number> => {

  const routerPositions = []

  const endpointNames = endpoints.map(e => e.endpoint)

  endpointNames.forEach(bestname => {
    const currentMeasurements = measurements.filter(m => m.endpoint == bestname)
    
    const inters = [];


    const addPoint = (long: number, lat: number) => {
      
      const x = long ? round(long) : null;
      const y = lat ? round(lat) : null;

      if (isNaN(x) || isNaN(y)) {
      } else {

        const found = inters.find(inte => posEqual(inte.position, [x,y]))

        if (!found) {
          inters.push({
            position: [x,y],
            count: 1
          })
        } else {
          found.count += 1
        }
      }
    }

    currentMeasurements.forEach(m1 => {

      currentMeasurements.forEach(m2 => {
        if (m1 != m2) {
            const points = intersection(m1.position, m1.distance, m2.position, m2.distance)
            addPoint(points[0], points[2])
            addPoint(points[1], points[3])
        }
      })
    })


    let best = inters[0]
    inters.forEach(inters => {
      if (inters.count > best.count) {
        best = inters
      }
    })
    
    const routerPosition = best.position;

    routerPositions.push({
      endpoint: bestname,
      position: routerPosition
    })
    
  })

  const myIntercections = []

  routerPositions.forEach(r => {
    routerPositions.forEach(r2 => {
      if (r !== r2) {
        const rbest = endpoints.find(b => b.endpoint === r.endpoint).distance;
        const r2best = endpoints.find(b => b.endpoint === r2.endpoint).distance;

        const inters = intersection(r.position, rbest, r2.position, r2best)

        
        const x = inters[0] ? round(inters[0]) : null;
        const y = inters[2]? round(inters[2]) : null;

        if (isNaN(x) || isNaN(y)) {
        } else {

          const found = myIntercections.find(inte => posEqual(inte.position, [x,y]))

          if (!found) {
            myIntercections.push({
              position: [x,y],
              count: 1
            })
          } else {
            found.count += 1
          }
        }
      }
    })
  })


  let mybest = myIntercections[0]
  myIntercections.forEach(inters => {
    if (inters.count > mybest.count) {
      mybest = inters
    }
  })


  return mybest.position;
}

module.exports = { getGeoLocation }
