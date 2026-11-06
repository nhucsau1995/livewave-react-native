/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { clock, compact, grouped, money } from './format.ts';

test('compact counts', () => {
  assert.equal(compact(842), '842');
  assert.equal(compact(1100), '1.1K');
  assert.equal(compact(12400), '12.4K');
  assert.equal(compact(2000), '2K');
  assert.equal(compact(128000), '128K');
  assert.equal(compact(1_250_000), '1.3M');
});

test('grouped, clock and money', () => {
  assert.equal(grouped(2481), '2,481');
  assert.equal(grouped(14000), '14,000');
  assert.equal(clock(1457), '00:24:17');
  assert.equal(clock(3600 + 61), '01:01:01');
  assert.equal(money(214.6), '$214.60');
});
