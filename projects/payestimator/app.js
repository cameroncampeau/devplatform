const   fs = require("fs"),
        path = require("path"),
        process = require("process"),
        simpleFit = require("simple-linear-regression");

const   FILE_PATH = path.resolve(__dirname + "/history.json"),
        PAY = 30

function getHistory() {
    return new Promise((resolve , reject) => {
        fs.readFile(FILE_PATH, (err, data) => {
            if (err) return reject(err);
            resolve(JSON.parse(data.toString()))
        })
    })
}
function avg(nums) {
    var total = 0;
    nums.forEach(n => total += n);
    return total / nums.length;
}

function analyzeHistory(history) {
    function avgProp(prop) {
        return avg(history.map(h => h[prop]))
    }
    var avg_pay = avgProp("pay");
    var avg_hours = avgProp("hours");
    var avg_tax_rate = avg(history.map(h => {
        var expected = h.hours * PAY;
        return 1 - (h.pay / expected);
    }))
    return {avg_hours, avg_pay, avg_tax_rate, historical_tax_rate: history.map(h => {
        var expected = h.hours * PAY;
        return 1 - (h.pay / expected);
    })}
}
function regressionAnalysis(hours, pays) {
    return simpleFit(hours,pays);
}

function printReport() {
    var analysis = analyzeHistory(history);
    console.table({...analysis, historical_tax_rate: analysis.historical_tax_rate.map(t => t.toString().substring(0,5)).toString()})
}

function estimatePay(hours) {
    var analysis = analyzeHistory(history);
    return (1 - analysis.avg_tax_rate) * hours * PAY
}
function estimatePayRegression(hours) {
    var coefficients = regressionAnalysis(history.map(h => h.hours), history.map(h => h.pay))
    return coefficients.a * hours + coefficients.b
// => { a: 61.27218654211061, b: -39.06195591884391 }
}

function printHelp() {
    console.log("====== Commands ======")
    console.log("report [r]: Display historical report")
    console.log("estimate [e] <hours>: Estimate pay based on <hours>")
}
function onInput(input) {
    var tokens = input.split(" "),
        command = tokens[0];
    switch(command){
        case "r":
        case "report":
            printReport();
            break;
        case "e":
        case "estimate":
            console.log("Simple Estimate:",estimatePay(parseFloat(tokens[1])))
            console.log("Regression Estimate:",estimatePayRegression(parseFloat(tokens[1])))
            break;
        default: 
            printHelp();
            break
    }
}
var history;
async function run() {
    history = await getHistory();
    process.stdin.addListener("data", (data) => {
        onInput(data.toString().trim().replace("\n", ""))
    })
    printHelp();
}

run()