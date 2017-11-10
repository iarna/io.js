'use strict';

const {
  ModuleWrap,
  setImportModuleDynamicallyCallback
} = internalBinding('module_wrap');
const debug = require('util').debuglog('esm');

const createDynamicModule = (exports, url = '', evaluate) => {
  debug(
    `creating ESM facade for ${url} with exports: ${exports.join(', ')}`
  );
  const names = exports.map((name) => `${name}`);
  // Create two modules: One whose exports are get- and set-able ('reflective'),
  // and one which re-exports all of these but additionally may
  // run an executor function once everything is set up.

  const namesAsDeclarations = names.map(
    (name) => `export let $${name};`
  ).join('\n');

  const namesAsExportedPsuedoProxies = names.map(
    (name) => `${name}: {
      get: () => $${name},
      set: v => $${name} = v
    }`
  ).join(',\n');

  // See EXAMPLE SPECIMEN below.
  const src = `
  export let executor;
  ${namesAsDeclarations}
  (() => ({
    setExecutor: fn => executor = fn,
    reflect: {
      exports: { ${namesAsExportedPsuedoProxies} }
    }
  }));`;

  const reflectiveModule = new ModuleWrap(src, `cjs-facade:${url}`);
  reflectiveModule.instantiate();
  const { setExecutor, reflect } = reflectiveModule.evaluate()();
  // public exposed ESM

  const namesDollarPrefixed = names.map((name) => `$${name}`);
  const namesReexported = names.map((name) => `$${name} as ${name}`).join(', ');
  const reexports = `
  import {
    executor,
    ${namesDollarPrefixed}
  } from "";
  export {
    ${namesReexported}
  }
  if (typeof executor === "function") {
    // add await to this later if top level await comes along
    executor()
  }`;

  if (typeof evaluate === 'function') {
    setExecutor(() => evaluate(reflect));
  }

  const module = new ModuleWrap(reexports, `${url}`);
  module.link(async () => reflectiveModule);
  module.instantiate();

  return {
    module,
    reflect
  };
};

module.exports = {
  createDynamicModule,
  setImportModuleDynamicallyCallback,
  ModuleWrap
};

// EXAMPLE SPECIMEN:
//
// given exports = ["iAmTheVeryModelOfA", "modernLoaderAlgorithm"]
//
// We will generate the source:
//
//    export let executor;
//    export let $iAmTheVeryModelOfA;
//    export let $modernLoaderAlgorithm;
//
//    (() => {
//      setExecutor: fn => executor,
//      reflect: {
//        iAmTheVeryModelOfA: {
//            get: () => $iAmTheVeryModelOfA,
//            set: v => $iAmTheVeryModelOfA = v
//        },
//        modernLoaderAlgorithm: {
//            get: () => $modernLoaderAlgorithm,
//            set: v => $modernLoaderAlgorithm = v
//        }
//    })
//
// The last function will be returned as the completion value
// of "evaluate()", exposing it back to our JS for manipulation.
