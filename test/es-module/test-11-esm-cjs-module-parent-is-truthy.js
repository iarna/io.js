// Prove that the parent of a CJS module required by
// ESM is truthy.
import { require } from 'nodejs';
import assert from 'assert';

const { parent } = require('../fixtures/es-modules-tests/cjs/export-module');

assert.strictEqual(require.cache[parent.id], parent);
assert.ok(parent.isESM);
