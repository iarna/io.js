import { require, __filename } from 'nodejs';
import assert from 'assert';

assert.ok(require.main); // there is a require.main!
assert.strictEqual(require.main.id, __filename); // it's us!
assert.strictEqual(require.main, process.mainModule);
