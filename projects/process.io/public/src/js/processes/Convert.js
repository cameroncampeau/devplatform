module.exports = exports = function(opts) {
    if (!opts) opts = {};
    var outType = null,
        inType = "any",
        run;
    switch(opts.output) {
        case "string":
            outType = "string";
            run = toString;
            break;
        case "integer":
            outType = "number";
            run = toInteger;
            break;
        case "float":
            run = toFloat;
            outType = "number";
            break;
        case "hexadecimal":
            run = toHexidecimal;
            outType = "string";
            inType = "number";
            break;
        default: return new Error("Invalid Output Type")
    }
    function toString(input) {
        return input.toString();
    }
    function toInteger(input) {
        return parseInt(input)
    }
    function toFloat(input) {
        return parseFloat(input);
    }
    function toHexidecimal(number) {
        return number.toString(16);
    }
    return { run, inType, outType };
  };
  