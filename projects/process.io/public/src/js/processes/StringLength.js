module.exports = exports = function(opts) {
  function run(str) {
    if (typeof str != "string") return str;
    return str.length;
  }
  return { run, inType: "string", outType: "number" };
};
