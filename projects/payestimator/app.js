const   fs = require("fs"),
        path = require("path"),
        process = require("process"),
        simpleFit = require("simple-linear-regression"),
        getHours = require('./estimatehours').getHours;

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

async function createEntry(month, year, pay, hours) {
    var obj = {month, year, pay, hours}
    var history = await getHistory();
    history.push(obj);
    fs.writeFileSync(FILE_PATH, JSON.stringify(history));
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

    return {avg_hours, avg_pay, avg_tax_rate,  historical_tax_rate: history.map(h => {
        var expected = h.hours * PAY;
        return 1 - (h.pay / expected);
    })}
}
function regressionAnalysis(Xs, Ys) {
    return simpleFit(Xs,Ys);
}

function printReport() {
    var analysis = analyzeHistory(history);
    console.table({...analysis, historical_tax_rate: analysis.historical_tax_rate.map(t => t.toString().substring(0,5)).toString()})
}
function estimateHours(pay) {
    var coefficients = regressionAnalysis(history.map(h => h.pay), history.map(h => h.hours));
    return coefficients.a * pay + coefficients.b;
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
Number.prototype.toStringFixedSize = function() {
    var this_str = this.toString();
    var decimal_idx = this_str.indexOf(".");
    if (decimal_idx > 0) return this_str.substring(0, decimal_idx + 3)
    else return this_str;
}

Number.prototype.toFixedDecimal = function() {
    return parseFloat(this.toStringFixedSize())
}

function printHelp() {
    console.log("====== Commands ======")
    console.log("create [c]: Create a payment entry")
    console.log("estimate [e]: Get a monthly estimate")
    console.log("estimate [e] <hours>: Estimate pay based on <hours>")
    console.log("report [r]: Display historical report")
}
function getEstimate() {
    function printEstimate() {
        var hours = getHours(month,days_in, year);
        hours = hours - (days_missed * 7)
        console.log("Estimating based on", hours,"hours (" + (hours / 7),"days)");
        console.log("Simple Estimate:",estimatePay(hours));
        console.log("Regression Estimate:",estimatePayRegression(hours));
    }
    var days_in = null,
        days_missed = null,
        month = null,
        year = null;
    process.stdin.removeListener("data", onInput);
    process.stdin.addListener("data", async function processEstimate(data) {
        data = data.toString().trim().replace("\r\n", "")
        if (!days_in) {
            days_in = data.split(" ").map(d => parseInt(d));
            console.log("How many days did you miss?")
        } else if (!days_missed) {
            days_missed = parseInt(data);
            console.log("Which month? (Empty for this month)")
        } else if (!month) {
            if (!parseInt(data)) month = new Date().getMonth() + 1;
            else month = parseInt(data);
            console.log("Which year? (Empty for this year)")
        } else {
            if (!parseInt(data)) year = new Date().getFullYear();
            else year = parseInt(data);
            printEstimate();
            process.stdin.removeListener("data", processEstimate);
            process.stdin.addListener("data", onInput);
        }
    })
    console.log("Which days were you in (0-indexed, 0=Sun)");
}
async function projectYear() {
    async function getAvgDaysMissed() {
        history = await getHistory(); 
        var days_missed = 0;
        history.forEach(h => {
            var {pay, hours, year, month} = h;
            var potential_hours = getHours(month, [3,4,5], parseInt(year));
            days_missed += Math.floor((potential_hours - hours) / 7)
        })
        return days_missed / history.length;
    }
    var curr_date = new Date();
    var curr_month = curr_date.getMonth();
    var curr_year = curr_date.getFullYear();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var table = {}
    var avg_days_missed = await getAvgDaysMissed();
    for (var i = 0; i < 12; i++) {
        var offset = curr_month + i;
        var month = offset % 12;
        var year = offset > 11 ? curr_year + 1 : curr_year;
        var hours = getHours(month+1, [3,4,5], year) - (avg_days_missed * 7);
        table[months[month]] = estimatePayRegression(hours).toFixedDecimal()
    }
    var total=0;
    for (m in table) {
        console.log(m, table[m])
        total += table[m]
    }
    table["total"] = total
    console.log("Projected Income Based on an average of", avg_days_missed.toFixedDecimal(), "days missed")
    console.table(table);
}
function processCommand(input) {
    var tokens = input.split(" "),
        command = tokens[0];
    switch(command){
        case "r":
        case "report":
            printReport();
            break;
        case "e":
        case "estimate":
            if (tokens[1]) {
                console.log("Simple Estimate:",estimatePay(parseFloat(tokens[1])))
                console.log("Regression Estimate:",estimatePayRegression(parseFloat(tokens[1])))
            } else {
                getEstimate()
            }
            break;
        case "c":
        case "create":
            var month = null,
                year = null,
                pay = null,
                hours = null;  
            process.stdin.removeListener("data", onInput);
            process.stdin.addListener("data", async function processNewEntry(data) {
                data = data.toString().trim().replace("\r\n", "");
                if (month == null) {
                    month = data;
                    console.log("Year:")
                }
                else if (year == null) {
                    year = data;
                    console.log("Pay:")
                }
                else if (pay == null) {
                    pay = parseFloat(data);
                    console.log("Hours:")
                }
                else {
                    hours = parseInt(data);
                    await createEntry(month, year, pay, hours);
                    console.log("Inserted", JSON.stringify({month, year,pay,hours}))
                    process.stdin.removeListener("data", processNewEntry);
                    process.stdin.addListener("data", onInput);
                }
            })
            console.log("Month:")
            break;
        case "p":
        case "project":
            projectYear();
            return;
        default: 
            printHelp();
            break
    }
}

function onInput(data) {
    processCommand(data.toString().trim().replace("\n", ""))
}

var history;
async function run() {
    history = await getHistory();
    process.stdin.addListener("data", onInput);
    printHelp();
}

run()