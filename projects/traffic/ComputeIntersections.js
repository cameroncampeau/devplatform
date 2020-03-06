function computeIntersections(roads) {
    // road = {getStart(), getEnd()}
    
}
function indexOfMaxValueLessThanX(arr, x) {
    // were doing a binary search here to find the largest index with value < x, assuming arr is sorted;
    var max = arr.length,
        min = 0;

    var max_idx = -1;
    var iterations = 0;
    while(max - min > 0) {
        iterations++
        var mid = Math.floor((max - min) / 2) + min
        if (x >= arr[mid]) {
            max_idx = mid;
            min = mid + 1;
        } else {
            max = mid - 1;
        }
    }
    //console.log({iterations})
    return max_idx;
}
function getIntersections(roads) {
    var north_south =   roads.filter(r => r.getDirection()[0] == "n" || r.getDirection[0] == "s").sort((a,b) => a.getEnd().y - b.getEnd().y)
    var east_west =     roads.filter(r => r.getDirection()[0] == "e" || r.getDirection[0] == "w").sort((a,b) => a.getEnd().x - b.getEnd().x)
    var intersections = [];
    for (road of north_south) {
        var start_idx = indexOfMaxValueLessThanX(east_west, road.getEnd().x); 
    }
}

function testIt(N, n) {
    for (var i = 0;i < N; i++) {
        var arr = Array(n).fill(0).map(n => Math.floor(Math.random() * n * 30)).sort((a,b) => {
            return a - b;
        })
        for (var e = 0; e < 5; e++) {
            var rand_idx = Math.floor(Math.random() * (n-1));
            for (;arr[rand_idx] == arr[rand_idx + 1] && rand_idx < n-1;rand_idx++) ;
            var idx;
            if ((idx = indexOfMaxValueLessThanX(arr, arr[rand_idx])) != rand_idx) {
                console.log("We got index", idx, "which is value", arr[idx], "when should be index", rand_idx, "with value", arr[rand_idx])
            }
        }
    }

}
testIt(50000, 1000);
/*
    function getSlope(start, end) {
        var x_delta = end.x - start.x;
        var x_start = start.x;
        var y_delta = end.y - start.y
        var y_start = start.y
        
        return {m: x_delta / y_delta, b: y_start};
    }


    function getIntercept(equation1)
    

*/