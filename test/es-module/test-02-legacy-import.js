'use strict';

const { fork } = require('child_process');
const assert = require('assert');
const path = require('path');

const proc = fork(
  path.resolve(__dirname, '..', 'fixtures', 'es-modules-tests',
               'esm', 'esm-imports-cjs.js'),
  [],
  { stdio: 'pipe' }
);

const accum = [];
proc.stderr.on('data', (buf) => {
  accum.push(buf);
});

proc.once('close', (code, signal) => {
  // we want the thing to fail with a reference error
  assert.notStrictEqual(code, 0);
  assert.ok(/ReferenceError/.test(String(Buffer.concat(accum))));
});
