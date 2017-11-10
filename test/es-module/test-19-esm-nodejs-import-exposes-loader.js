// Flags: --harmony_dynamic_import --mode=esm
import { loader } from 'nodejs';
import assert from 'assert';

const BANANA_MESSAGE = 'this is an exported reflective banana'
loader.hook({
  resolve (request, parentURL) {
    return {
      format: 'dynamic',
      url: 'fruittp://banana'
    }
  },
  async dynamicInstantiate (url) {
    return {
      exports: ['banana'],
      execute (reflector) {
        console.log(reflector)
        reflector.banana.set(BANANA_MESSAGE)
      }
    }
  }
})

import('a thing').then(expectedSnack => {
  assert.strictEqual(expectedSnack.banana, BANANA_MESSAGE);
}).catch(err => {
  console.error(err.stack);
  process.exit(1);
})
