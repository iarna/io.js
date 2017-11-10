// Flags: --harmony_dynamic_import --mode=esm
/*eslint import/no-named-as-default-member: 0 */

import { loader } from 'nodejs';
import assert from 'assert';

loader.hook({
  async transpile(url, str) {
    if (/.pig$/.test(url)) {
      return str.replace(/(\w+)(\w)ay/g, '$2$1');
    }
    return str;
  }
});

main().catch(err => {
  console.error(err);
  process.exit(1);
})

async function main () {
  const [pig, normal] = await Promise.all([
    import('../fixtures/es-modules-tests/esm/encrypted.pig'),
    import('../fixtures/es-modules-tests/esm/vanilla-esm-module.js')
  ])

  assert.deepEqual(pig, {default: {'hello': 'world'}});
  assert.equal(normal.value, 0xcafed00d);
}
