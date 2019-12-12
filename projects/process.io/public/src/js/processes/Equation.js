import math from "../libs/math.min.js";
module.exports = exports = function(opts) {
  function run(num) {
    return math.eval(opts.equation || "$num", { $num: num });
  }
  return { run, inType: "number",outType: "number" };
};
