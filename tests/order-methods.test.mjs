import test from 'node:test';
import assert from 'node:assert/strict';
import { orderMethods } from '../src/lib/order-methods.ts';

test('ordinary ordering requires an open business and enabled method', () => {
 assert.deepEqual(orderMethods({accepting_orders:true,pickup_enabled:true,delivery_enabled:false},false), ['pickup']);
 assert.deepEqual(orderMethods({accepting_orders:true,pickup_enabled:false,delivery_enabled:true},false), ['delivery']);
 assert.deepEqual(orderMethods({accepting_orders:false,pickup_enabled:true,delivery_enabled:true},false), []);
});
test('pilot only overrides reception for enabled pickup', () => {
 assert.deepEqual(orderMethods({accepting_orders:false,pickup_enabled:true,delivery_enabled:true},true), ['pickup']);
 assert.deepEqual(orderMethods({accepting_orders:false,pickup_enabled:false,delivery_enabled:true},true), []);
});
test('missing or malformed method flags fail closed', () => {
 assert.deepEqual(orderMethods({accepting_orders:true},false), []);
 assert.deepEqual(orderMethods({accepting_orders:true,pickup_enabled:'true',delivery_enabled:1},false), []);
});
