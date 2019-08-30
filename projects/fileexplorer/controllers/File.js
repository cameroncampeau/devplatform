var fs = require('fs'),
    Path = require("path");


var fsp = {
    readdir: function(path) {
        path = Path.resolve(path);
        return new Promise((res, rej) => {
            fs.readdir(path, (err, files) => {
                if (err) return rej(err);
                res(files);
            })
        })
    },
    lstat: function(path) {
        path = Path.resolve(path);
        return new Promise((res, rej) => {
            fs.lstat(path, (err, stat) => {
                if (err) return rej(err);
                res(stat);
            })
        })
    }
}
function quicksort(arr, prop) {
    if (arr.length < 2) return arr;
    var left = [],
        right = [],
        pivot = Math.floor(arr.length / 2),
        pivotVal = arr[pivot][prop];
    for (var i = 0; i < arr.length ;i ++) {
        if (i == pivot) continue;
        if (arr[i][prop] < pivotVal) left.push(arr[i]);
        else right.push(arr[i]);
    }
    return quicksort(left).concat([arr[pivot]]).concat(quicksort(right))
}
async function getDirContents(path) {
    var files = await fsp.readdir(path);
    var filearr = [];
    await Promise.all(files.map(async f => {
        var filepath = path + "/" + f;
        try {
            var stat = await fsp.lstat(filepath);
            if (!stat) return;
        } catch(e) {
            return;
        }

        filearr.push({name: f, path: filepath,  directory: stat.isDirectory(), stats: stat})
    }))
    return quicksort(filearr, "name");
}

module.exports = {getDirContents}