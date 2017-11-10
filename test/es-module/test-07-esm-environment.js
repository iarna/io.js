import assert from 'assert';

assert.strictEqual(typeof this, 'undefined');
assert.strictEqual(typeof module, 'undefined');
assert.strictEqual(typeof global, 'object');
assert.strictEqual(typeof process, 'object');
assert.strictEqual(typeof Buffer, 'function');
