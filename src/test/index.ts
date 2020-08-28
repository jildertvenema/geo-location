import Measurement from "../../types/measurement"

const { endpoints } = require('./test-data')
const { getGeoLocation } = require('..//get-geo-location')

const measurements = []
const testPost = [53.249661, 6.152776]

const DEVIATION_PERCENTAGE = 1;

const getDistance = (p1, p2) => {
  const diffx = Math.abs(p1[0] - p2[0])
  const diffy = Math.abs(p1[1] - p2[1])

  // also distance
  const radius = Math.sqrt(diffx*diffx+diffy*diffy)

  return radius;
}

const getDeviation = (n) => {
  const percentage = 100 - Math.floor(Math.random() * DEVIATION_PERCENTAGE* 100) / 100;
  return n / 100 * percentage
}

const messure = (x1, x2, xstep, y1, y2, ystep) => {
  for (let x = x1; x <= x2; x += xstep) {
    for (let y = y1; y <= y2; y+= ystep) {
  
      endpoints.forEach((measurement: Measurement) => {
        // also distance
        // Small deviation calculation with a percentage
        const radius = getDeviation(getDistance(measurement.position, [x, y]))
  
        measurements.push({
          endpoint: measurement.endpoint,
          distance: radius, 
          position: [x,y]
        })
      })
  
    }
  }
}

messure(53.251377, 53.251902, 0.0001, 6.154783, 6.154979, 0.00005)
messure(53.250846, 53.251377, 0.0001, 6.153339, 6.154979, 0.00005)


const testMeasurements = []

endpoints.forEach(endpoint => {
  const distance = getDistance(endpoint.position, testPost)
  testMeasurements.push({
    endpoint: endpoint.endpoint,
    distance: distance
  })
})


const best3 = testMeasurements.sort((a,b) => a.distance - b.distance).slice(0,3)
const result = getGeoLocation(measurements, best3)

console.log('Calculated position: ', result )
console.log('Actual position: ', testPost )
