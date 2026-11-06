/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { canAfford, coinsToUsd, giftTotal } from './wallet.ts';

test('gift totals and balance check', () => {
  assert.equal(giftTotal(100, 5), 500);
  assert.equal(canAfford(1250, 100, 10), true);
  assert.equal(canAfford(1250, 500, 5), false);
});

test('coins to creator earnings', () => {
  assert.equal(coinsToUsd(6450), 45.15);
  assert.equal(coinsToUsd(100), 0.7);
});
