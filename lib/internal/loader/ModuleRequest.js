'use strict';

const internalCJSModule = require('internal/module');
const internalURLModule = require('internal/url');
const internalFS = require('internal/fs');
const NativeModule = require('native_module');
const { dirname } = require('path');
const { URL } = require('url');
const { realpathSync } = require('fs');
const preserveSymlinks = !!process.binding('config').preserveSymlinks;
const {
  ModuleWrap,
  createDynamicModule
} = require('internal/loader/ModuleWrap');
const errors = require('internal/errors');

const search = require('internal/loader/search');
const asyncReadFile = require('util').promisify(require('fs').readFile);
const debug = require('util').debuglog('esm');

const realpathCache = new Map();

const loaders = new Map();
exports.loaders = loaders;

let mainModuleURL = null;

exports.setMainURL = function(mainURL) {
  debug(`Setting main ESM url to: "${mainURL}"`);
  mainModuleURL = mainURL;
};

// Strategy for loading a standard JavaScript module
loaders.set('js', async (url, loader) => {
  const originalSource = `${await asyncReadFile(new URL(url))}`;
  const source = await loader.transpile(url, originalSource);

  debug(`Loading StandardModule ${url}`);
  return {
    module: new ModuleWrap(internalCJSModule.stripShebang(source), url),
    reflect: undefined
  };
});

// Strategy for loading a node builtin CommonJS module that isn't
// through normal resolution
loaders.set('builtin', async (url, loader) => {
  const exports = NativeModule.require(url);
  const keys = Object.keys(exports);
  return createDynamicModule(['default', ...keys], url, (reflect) => {
    debug(`Loading BuiltinModule ${url}`);
    for (const key of keys) {
      reflect.exports[key].set(exports[key]);
    }
    reflect.exports.default.set(exports);
  });
});

loaders.set('nodejs', async (url, loader) => {
  return createDynamicModule([
    'default',
    'require',
    '__dirname',
    '__filename',
    'loader',
    'isMain'
  ], url, (reflect) => {
    debug(`Loading nodejs context for ${url}`);
    const urlSansPrefix = url.slice('nodejs:'.length);
    const CJSModule = require('module');
    const pathname = internalURLModule.getPathFromURL(
      new URL(urlSansPrefix)
    );
    const mod = CJSModule._fromESMFacade(pathname);
    const exports = {
      require: internalCJSModule.makeRequireFunction(mod),
      __dirname: dirname(pathname),
      __filename: pathname,
      isMain: pathname === mainModuleURL,
      loader
    };

    if (exports.isMain) {
      exports.require.main = mod;
      process.mainModule = mod;
    }

    reflect.exports.default.set(exports);
    reflect.exports.require.set(exports.require);
    reflect.exports.__dirname.set(exports.__dirname);
    reflect.exports.__filename.set(exports.__filename);
    reflect.exports.isMain.set(exports.isMain);
    reflect.exports.loader.set(exports.loader);
  });
});

exports.resolve = (specifier, parentURL) => {
  if (specifier === 'nodejs') {
    return {
      url: `nodejs:${parentURL}`,
      format: 'nodejs'
    };
  }

  if (NativeModule.nonInternalExists(specifier)) {
    return {
      url: specifier,
      format: 'builtin'
    };
  }

  let url;
  try {
    url = search(specifier, parentURL);
  } catch (e) {
    if (e.message && e.message.startsWith('Cannot find module'))
      e.code = 'MODULE_NOT_FOUND';
    throw e;
  }

  if (url.protocol !== 'file:') {
    throw new errors.Error('ERR_INVALID_PROTOCOL',
                           url.protocol, 'file:');
  }

  if (!preserveSymlinks) {
    const real = realpathSync(internalURLModule.getPathFromURL(url), {
      [internalFS.realpathCacheKey]: realpathCache
    });
    const old = url;
    url = internalURLModule.getURLFromFilePath(real);
    url.search = old.search;
    url.hash = old.hash;
  }

  return { url: `${url}`, format: 'js' };
};
