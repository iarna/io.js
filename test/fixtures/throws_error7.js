// This line forces the file to be interpreted as CommonJS.
require;

throw {
  toString: function() {
    throw this;
  }
};
