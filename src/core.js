/**
 * Converts degrees to radians.
 *
 * This function exists because the spherical law of cosines formula
 * requires angular values in radians, but latitude and longitude are
 * conventionally expressed in degrees.
 *
 * @param {number} degrees - Angle in degrees.
 * @returns {number} Angle in radians.
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Checks whether a latitude value is within the valid range.
 *
 * Valid latitudes are between -90 and 90 degrees inclusive. The check is
 * inclusive because the poles are legitimate locations.
 *
 * @param {number} latitude - Latitude in degrees.
 * @returns {boolean} True if latitude is in [-90, 90].
 */
export function isValidLatitude(latitude) {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

/**
 * Checks whether a longitude value is within the valid range.
 *
 * Valid longitudes are between -180 and 180 degrees inclusive. The
 * antimeridian (180 / -180) is included because it is a real meridian.
 *
 * @param {number} longitude - Longitude in degrees.
 * @returns {boolean} True if longitude is in [-180, 180].
 */
export function isValidLongitude(longitude) {
  return Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

/**
 * Computes the great-circle distance between two points on a sphere.
 *
 * Uses the spherical law of cosines. For antipodal points this formula
 * can suffer from rounding errors, but it is simpler and faster than the
 * haversine formula for most inputs. Coordinates must be given in degrees.
 *
 * @param {number} lat1 - Latitude of first point in degrees.
 * @param {number} lon1 - Longitude of first point in degrees.
 * @param {number} lat2 - Latitude of second point in degrees.
 * @param {number} lon2 - Longitude of second point in degrees.
 * @param {number} [radius=6371.0088] - Sphere radius in kilometres.
 *   Defaults to Earth's mean radius.
 * @returns {number} Distance in the same unit as the radius.
 * @throws {RangeError} If any coordinate is out of range or not finite.
 */
export function greatCircleDistance(lat1, lon1, lat2, lon2, radius = 6371.0088) {
  if (!isValidLatitude(lat1)) {
    throw new RangeError(`Invalid latitude: ${lat1}`);
  }
  if (!isValidLongitude(lon1)) {
    throw new RangeError(`Invalid longitude: ${lon1}`);
  }
  if (!isValidLatitude(lat2)) {
    throw new RangeError(`Invalid latitude: ${lat2}`);
  }
  if (!isValidLongitude(lon2)) {
    throw new RangeError(`Invalid longitude: ${lon2}`);
  }
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError(`Invalid radius: ${radius}`);
  }

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaLambda = toRadians(lon2 - lon1);

  const cosC = Math.sin(phi1) * Math.sin(phi2)
    + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  // Floating-point rounding may push cosC slightly outside [-1, 1].
  const clamped = Math.min(1, Math.max(-1, cosC));
  return radius * Math.acos(clamped);
}
