/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "iDoNothing" }]*/

// This file is unambiguously esm and should be detected correctly.

export const foo = 3;

function iDoNothing() {
  return foo;
}
