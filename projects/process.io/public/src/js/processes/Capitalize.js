module.exports = exports = function(opts) {
  if (!opts) opts = {};
  function run(str) {
    function firstOnly() {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    if (typeof str != "string") return str;
    return opts.firstOnly ? firstOnly() : str.toUpperCase();
  }
  return { run, opts, inType: "string", outType: "string" };
};
