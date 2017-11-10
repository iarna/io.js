// Prove that we can import named functions from Node
// builtins. This file may explode outright if this
// functionality is broken.
import { readFile } from 'fs';
import { require } from 'nodejs';
import assert from 'assert';

assert.strictEqual(require('fs').readFile, readFile);
