'use strict';

const { fork } = require('child_process');
const assert = require('assert');
const path = require('path');

const proc = fork(
  path.resolve(__dirname, '..', 'fixtures', 'es-modules-tests',
               'esm', 'esm-imports-name-from-cjs.js'),
  [],
  { stdio: 'pipe' }
);

const accum = [];
proc.stderr.on('data', (buf) => {
  accum.push(buf);
});

proc.once('close', (code, signal) => {
  // We want the thing to fail with a syntax error from v8
  // because a CJS module has no name.
  assert.notStrictEqual(code, 0);
  const result = String(Buffer.concat(accum));
  assert.ok(/SyntaxError: The requested module does not provide an export named/.test(result));
});
