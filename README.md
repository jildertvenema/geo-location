# Offline Geo-location

Returns a calculated latitude and longitude based on your own offline measurements based on Wi-Fi access points and their signal strengths that have been converted to a distance.

## Installation

```terminal
npm i --save offline-geo-location
```

## Usage

```ts
import getGeoLocation from 'offline-geo-location'

const previousMeasurements: Array<Measurement> // The measurements you did beforehand
const currentAccessPointsMeasurements: Array<Endpoint> // Your current scanned Wi-Fi access points with a distance

const [latitude, longitude] = getGeoLocation(previousMeasurements, currentAccessPointsMeasurements)
```

## Types
```ts
const getGeoLocation = (measurements: Array<Measurement>, accessPointsMeasurements: Array<Endpoint>): Array<number, number> => {}

class Measurement {
  endpoint: string; // SSID or MAC-adress
  distance: number;
  position: [number, number];
}

export default class Endpoint {
  endpoint: string; // SSID or MAC-adress
  distance: number;
}
```

