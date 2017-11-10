/*eslint max-len: ["error", { "ignoreStrings": true }]*/

// We are proving that the node module resolution algorithm picks up packages &
// resolves their contents as expected. See the associated fixtures (verbosely
// listed below) for more details.
import assert from 'assert';

import { value as foo } from
  '../fixtures/es-modules-tests/esm/nmr-esm-with-inner-dependencies.js';
import { value as bar } from
  '../fixtures/es-modules-tests/esm/nmr-esm-with-package-json-and-index.js';
import { value as baz } from
  '../fixtures/es-modules-tests/esm/nmr-esm-with-package-json-and-named-main.js';

assert.strictEqual(foo, 'you have found the secret, you can require through packages');
assert.strictEqual(bar,
                   'surely you are amazed by the degree to which this package was' +
                   ' unnamed, and the skill node displayed in inferring a name');
assert.strictEqual(baz, 'are you not impressed by how this package was named?');
