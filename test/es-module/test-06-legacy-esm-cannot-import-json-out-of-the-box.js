'use strict';

const { fork } = require('child_process');
const assert = require('assert');
const path = require('path');

const proc = fork(
  path.resolve(__dirname, '..', 'fixtures',
               'es-modules-tests', 'esm', 'esm-imports-json.js'),
  [],
  { stdio: 'pipe' }
);

const accum = [];
proc.stderr.on('data', (buf) => {
  accum.push(buf);
});

proc.once('close', (code, signal) => {
  // We want the thing to fail with a syntax error from v8
  // because top level objects in JSON are not valid JS.
  assert.notStrictEqual(code, 0);
  const result = String(Buffer.concat(accum));
  assert.ok(/SyntaxError:/.test(result));
});
