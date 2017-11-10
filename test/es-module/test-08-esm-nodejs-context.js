import nodeContext from 'nodejs';
import assert from 'assert';

import { isMain as childIsMain }
  from '../fixtures/es-modules-tests/esm/is-it-main';

import path from 'path';

// We already know (from prior tests) that require is
// a function available in nodeContext.
assert.strictEqual(nodeContext.isMain, true);
assert.strictEqual(childIsMain, false);

const dirname = nodeContext.__dirname.split(path.sep).join('/');
const filename = nodeContext.__filename.split(path.sep).join('/');

assert.ok(/\/test\/es-module$/.exec(dirname));
assert.ok(/\/test\/es-module\/test-08-esm-nodejs-context\.js$/.exec(filename));
