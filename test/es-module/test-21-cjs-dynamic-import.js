// Flags: --harmony_dynamic_import --mode legacy
const assert = require('assert');

const getModule = import('../fixtures/es-modules-tests/esm/vanilla-esm-module');

getModule.then(({value}) => {
  assert.equal(value, 0xcafed00d);
}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});
