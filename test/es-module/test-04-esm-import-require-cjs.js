// Can we use ESM's "require" (imported from "nodejs") to require a valid CJS
// module?
import { require } from 'nodejs';
import assert from 'assert';
const value = require('../fixtures/es-modules-tests/cjs/vanilla-cjs-module');
assert.strictEqual(value, 0xdeadbeef);
