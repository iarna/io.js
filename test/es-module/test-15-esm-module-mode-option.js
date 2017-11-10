// Flags: --mode esm

try {
  // This is expected to throw. If it does not, mode flag parsing has failed.
  require('fs');
  process.exit(1);
} catch (ex) {

}
