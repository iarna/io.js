import { require } from 'nodejs';

try {
  require('assert');
} catch (err) {
  throw new Error(`Could not require assert (reason: ${err.stack})`);
}
