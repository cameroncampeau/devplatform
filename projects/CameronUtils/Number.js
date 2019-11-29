Number.prototype.toStringFixedSize = function() {
    var this_str = this.toString();
    var decimal_idx = this_str.indexOf(".");
    if (decimal_idx > 0) return this_str.substring(0, decimal_idx + 3)
    else return this_str;
}

Number.prototype.toFixedDecimal = function() {
    return parseFloat(this.toStringFixedSize())
}
