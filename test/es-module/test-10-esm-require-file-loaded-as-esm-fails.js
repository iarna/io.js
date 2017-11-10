import { __filename, require } from 'nodejs';
import assert from 'assert';

try {
  require(__filename);
  process.exit(1);
} catch (err) {
  assert.strictEqual(err.message, 'Cannot require module previously ' +
    `loaded as ES module: ${__filename}`);
}
