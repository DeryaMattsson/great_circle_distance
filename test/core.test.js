import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  greatCircleDistance,
  toRadians,
  isValidLatitude,
  isValidLongitude,
} from '../src/core.js';

const EARTH_RADIUS_KM = 6371.0088;
const EPSILON = 1e-9;

test('toRadians converts common angles', () => {
  assert.ok(Math.abs(toRadians(0) - 0) < EPSILON);
  assert.ok(Math.abs(toRadians(180) - Math.PI) < EPSILON);
  assert.ok(Math.abs(toRadians(90) - Math.PI / 2) < EPSILON);
  assert.ok(Math.abs(toRadians(-180) - -Math.PI) < EPSILON);
});

test('toRadians handles decimal degrees', () => {
  assert.ok(Math.abs(toRadians(57.29577951308232) - 1) < EPSILON);
});

test('isValidLatitude accepts boundary values', () => {
  assert.equal(isValidLatitude(-90), true);
  assert.equal(isValidLatitude(90), true);
  assert.equal(isValidLatitude(0), true);
});

test('isValidLatitude rejects out-of-range values', () => {
  assert.equal(isValidLatitude(-90.0001), false);
  assert.equal(isValidLatitude(90.0001), false);
  assert.equal(isValidLatitude(NaN), false);
  assert.equal(isValidLatitude(Infinity), false);
});

test('isValidLongitude accepts boundary values', () => {
  assert.equal(isValidLongitude(-180), true);
  assert.equal(isValidLongitude(180), true);
  assert.equal(isValidLongitude(0), true);
});

test('isValidLongitude rejects out-of-range values', () => {
  assert.equal(isValidLongitude(-180.0001), false);
  assert.equal(isValidLongitude(180.0001), false);
  assert.equal(isValidLongitude(NaN), false);
  assert.equal(isValidLongitude(Infinity), false);
});

test('greatCircleDistance returns zero for identical points', () => {
  assert.ok(Math.abs(greatCircleDistance(0, 0, 0, 0)) < EPSILON);
  assert.ok(Math.abs(greatCircleDistance(-45.5, 120.25, -45.5, 120.25)) < EPSILON);
});

test('greatCircleDistance computes quarter circumference', () => {
  const quarter = (Math.PI / 2) * EARTH_RADIUS_KM;
  assert.ok(Math.abs(greatCircleDistance(0, 0, 0, 90) - quarter) < 1e-6);
});

test('greatCircleDistance computes known route', () => {
  // Paris (48.8566, 2.3522) to London (51.5074, -0.1278)
  // Known distance is approximately 343.5 km.
  const d = greatCircleDistance(48.8566, 2.3522, 51.5074, -0.1278);
  assert.ok(Math.abs(d - 343.5) < 1.0);
});

test('greatCircleDistance handles antipodal points', () => {
  const d = greatCircleDistance(0, 0, 0, 180);
  const expected = Math.PI * EARTH_RADIUS_KM;
  assert.ok(Math.abs(d - expected) < 1e-6);
});

test('greatCircleDistance handles points on opposite sides of antimeridian', () => {
  const d = greatCircleDistance(0, 179, 0, -179);
  const expected = toRadians(2) * EARTH_RADIUS_KM;
  assert.ok(Math.abs(d - expected) < 1e-6);
});

test('greatCircleDistance accepts custom radius', () => {
  const d = greatCircleDistance(0, 0, 0, 90, 1);
  assert.ok(Math.abs(d - Math.PI / 2) < EPSILON);
});

test('greatCircleDistance throws on invalid latitude', () => {
  assert.throws(() => greatCircleDistance(91, 0, 0, 0), RangeError);
  assert.throws(() => greatCircleDistance(-91, 0, 0, 0), RangeError);
  assert.throws(() => greatCircleDistance(NaN, 0, 0, 0), RangeError);
});

test('greatCircleDistance throws on invalid longitude', () => {
  assert.throws(() => greatCircleDistance(0, 181, 0, 0), RangeError);
  assert.throws(() => greatCircleDistance(0, -181, 0, 0), RangeError);
  assert.throws(() => greatCircleDistance(0, Infinity, 0, 0), RangeError);
});

test('greatCircleDistance throws on invalid radius', () => {
  assert.throws(() => greatCircleDistance(0, 0, 0, 90, 0), RangeError);
  assert.throws(() => greatCircleDistance(0, 0, 0, 90, -1), RangeError);
  assert.throws(() => greatCircleDistance(0, 0, 0, 90, NaN), RangeError);
});
