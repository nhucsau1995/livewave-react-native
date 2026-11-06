/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { average, backoffSchedule, classify, nextBitrate } from './health.ts';

test('classify stream health', () => {
  assert.equal(classify({ bitrateKbps: 3200, fps: 30, latencyMs: 312, packetLoss: 0.4 }), 'Excellent');
  assert.equal(classify({ bitrateKbps: 2200, fps: 30, latencyMs: 312, packetLoss: 0.4 }), 'Good');
  assert.equal(classify({ bitrateKbps: 3200, fps: 30, latencyMs: 900, packetLoss: 0.4 }), 'Poor');
  assert.equal(classify({ bitrateKbps: 3200, fps: 30, latencyMs: 300, packetLoss: 6 }), 'Poor');
});

test('exponential backoff 1s to 16s', () => {
  assert.deepEqual(backoffSchedule(5), [1000, 2000, 4000, 8000, 16000]);
  assert.deepEqual(backoffSchedule(7).slice(-2), [16000, 16000]);
  assert.deepEqual(backoffSchedule(0), []);
});

test('adaptive bitrate pulls toward target', () => {
  let b = 1500;
  for (let t = 0; t < 40; t++) b = nextBitrate(b, t, 3000, true);
  assert.ok(Math.abs(b - 3000) < 600, `bitrate ${b}`);
  assert.equal(average([1, 2, 3]), 2);
});
