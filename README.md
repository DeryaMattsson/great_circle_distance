# Great Circle Distance

Computes the shortest distance between two latitude-longitude points on a sphere using the spherical law of cosines.

## Usage

```javascript
import { greatCircleDistance } from './src/index.js';

const paris = { lat: 48.8566, lon: 2.3522 };
const london = { lat: 51.5074, lon: -0.1278 };

const distanceKm = greatCircleDistance(
  paris.lat, paris.lon,
  london.lat, london.lon
);

console.log(distanceKm); // ~343.5 km
```

## Why this library exists

Calculating the distance between two points on the Earth is a common need, but the naive planar distance formula is wrong because the Earth is not flat. The spherical law of cosines provides a simple, direct way to compute the great-circle distance with only a few trigonometric operations.

The trade-off: the spherical law of cosines is fast and short, but it can lose precision for very close points and for antipodal points. For most uses on Earth-sized spheres the error is negligible. If you need better numerical stability for very small distances, the haversine formula is a better choice, but it is slightly more expensive.

## Edge case: invalid coordinates

This library validates latitude and longitude and throws a `RangeError` for out-of-range or non-finite values. Latitude must be in `[-90, 90]` and longitude in `[-180, 180]`. The default radius is the Earth's mean radius in kilometres (6371.0088 km), but you can pass any positive radius.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

