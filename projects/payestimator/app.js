const fs = require("fs"),
	path = require("path"),
	process = require("process"),
	simpleFit = require("simple-linear-regression"),
	getHours = require("./estimatehours").getHours;

const FILE_PATH = path.resolve(__dirname + "/history.json"),
	PAY = 30;

	
function monthStrToInt(month_str) {
	var months = "january february march april may june july august september octover november december".split(" ");
	return ("0" + (months.indexOf(month_str) + 1)).slice(-2)
}
function getHistory() {
	return new Promise((resolve, reject) => {
		fs.readFile(FILE_PATH, (err, data) => {
			if (err) return reject(err);
			resolve(JSON.parse(data.toString()));
		});
	});
}
function getSchedule() {
	return new Promise((res, rej) => {
		fs.readFile(path.resolve(__dirname + "/schedule.json"), (err, data) => {
			if (err) return rej(err);
			res(JSON.parse(data.toString()));
		});
	});
}
function getScheduleForMonth(month, year) {
	function isBetween(n, min, max) {
		return n >= min && n <= max;
	}
	var default_schedule = [1, 2, 3, 4, 5];
	for (var i = 0; i < schedule.length; i++) {
		var s = schedule[i];
		if (
			isBetween(year, s.start.year, s.end.year) &&
			isBetween(month, s.start.month, s.end.month)
		)
			return { daysIn: s.daysIn, avg_hours_in: s.avg_hours_in || 7 };
	}
	return { daysIn: default_schedule, avg_hours_in: 7 };
}

async function createEntry(month, year, pay, hours) {
	var obj = { month, year, pay, hours };
	var history = await getHistory();
	history.push(obj);
	fs.writeFileSync(FILE_PATH, JSON.stringify(history));
}

function avg(nums) {
	var total = 0;
	nums.forEach(n => (total += n));
	return total / nums.length;
}

function analyzeHistory() {
	function avgProp(prop) {
		return avg(history.map(h => h[prop]));
	}
	var avg_pay = avgProp("pay");
	var avg_hours = avgProp("hours");
	var avg_tax_rate = avg(
		history.map(h => {
			var expected = h.hours * PAY;
			return 1 - h.pay / expected;
		})
	);
	var total_pay = avg_pay * history.length,
		total_taxes = total_pay * avg_tax_rate;

	return {
		avg_hours,
		avg_pay,
		avg_tax_rate,
		total_pay,
		total_taxes,
		historical_tax_rate: history.slice(0, 10).map(h => {
			var expected = h.hours * PAY;
			return 1 - h.pay / expected;
		})
	};
}
function regressionAnalysis(Xs, Ys) {
	return simpleFit(Xs, Ys);
}

function printReport() {
	var analysis = analyzeHistory(history);
	for (key in analysis) {
		if (typeof analysis[key] == "number")
			analysis[key] = analysis[key].toFixedDecimal();
	}
	console.table({
		...analysis,
		historical_tax_rate: analysis.historical_tax_rate
			.map(t => t.toStringFixedSize())
			.join(",")
	});

	var days_missed = getDaysMissed();
	console.log("Days Missed");
	console.table(days_missed);
}

function estimatePay(hours) {
	var analysis = analyzeHistory();
	return (1 - analysis.avg_tax_rate) * hours * PAY;
}
function estimatePayRegression(hours) {
	var coefficients = regressionAnalysis(
		history.map(h => h.hours),
		history.map(h => h.pay)
	);
	return coefficients.a * hours + coefficients.b;
}
Number.prototype.toStringFixedSize = function() {
	var this_str = this.toString();
	var decimal_idx = this_str.indexOf(".");
	if (decimal_idx > 0) return this_str.substring(0, decimal_idx + 3);
	else return this_str;
};

Number.prototype.toFixedDecimal = function() {
	return parseFloat(this.toStringFixedSize());
};

function printHelp() {
	console.log("====== Commands ======");
	console.log("create     [c]: Create a payment entry");
	console.log("estimate   [e]: Get a monthly estimate");
	console.log("estimate   [e] <hours>: Estimate pay based on <hours>");
	console.log("project    [p]: Project pay for the next year");
	console.log("report     [r]: Display historical report");
}
function getEstimate() {
	function printEstimate() {
		var schedule = getScheduleForMonth(month, year);
		var hours = getHours(month, days_in, year, schedule.avg_hours_in);
		hours = hours - days_missed * schedule.avg_hours_in;
		console.log(
			"Estimating based on",
			hours,
			"hours (" + hours / schedule.avg_hours_in,
			"days)"
		);
		console.log("Simple Estimate:", estimatePay(hours));
		console.log("Regression Estimate:", estimatePayRegression(hours));
	}
	var days_in = null,
		days_missed = null,
		month = null,
		year = null;
	process.stdin.removeListener("data", onInput);
	process.stdin.addListener("data", async function processEstimate(data) {
		data = data
			.toString()
			.trim()
			.replace("\r\n", "");
		if (days_in == null) {
			days_in = data.split(" ").map(d => parseInt(d));
			console.log("How many days did you miss?");
		} else if (days_missed == null) {
			days_missed = parseFloat(data) || 0;
			console.log("Which month? (Empty for this month)");
		} else if (month == null) {
			if (Number.isNaN(parseInt(data))) month = new Date().getMonth() + 1;
			else month = parseInt(data);
			console.log("Which year? (Empty for this year)");
		} else {
			if (Number.isNaN(parseInt(data))) year = new Date().getFullYear();
			else year = parseInt(data);
			console.log(days_in, days_missed, month, year);
			printEstimate();
			process.stdin.removeListener("data", processEstimate);
			process.stdin.addListener("data", onInput);
		}
	});
	console.log("Which days were you in (0-indexed, 0=Sun)");
}
function getDaysMissed() {
	var days_missed = {};
	history.forEach(h => {
		var { pay, hours, year, month } = h;
		var schedule = getScheduleForMonth(
			new Date(month + "/01/19").getMonth() + 1,
			parseInt(year)
		);
		var potential_hours = getHours(month, schedule.daysIn, parseInt(year));
		days_missed[month + " " + year] = (
			(potential_hours - hours) /
			schedule.avg_hours_in
		).toFixedDecimal();
	});
	return days_missed;
}
async function projectYear(num_months = 12) {
	async function getAvgDaysMissed() {
		var days_missed = 0;
		history.forEach(h => {
			var { pay, hours, year, month } = h;
			var schedule = getScheduleForMonth(
				new Date(monthStrToInt(month) + "/01/19").getMonth() + 1,
				parseInt(year)
			).daysIn;
			var potential_hours = getHours(month, schedule, parseInt(year));
			console.log(month, year, schedule, Math.floor((potential_hours - hours) / 7))
			days_missed += Math.floor((potential_hours - hours) / 7);
		});
		return days_missed / history.length;
	}
	var curr_date = new Date();
	var curr_month = curr_date.getMonth();
	var curr_year = curr_date.getFullYear();
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	var table = {};
	var avg_days_missed = await getAvgDaysMissed();
	for (var i = 0; i < num_months; i++) {
		var offset = curr_month + i;
		var month = offset % 12;
		var year = offset > 11 ? curr_year + 1 : curr_year;
		var schedule = getScheduleForMonth(month + 1, year);
		var hours =
			getHours(
				month + 1,
				schedule.daysIn,
				year,
				schedule.avg_hours_in || 7
			) -
			avg_days_missed * (schedule.avg_hours_in || 7);
		table[months[month]] = estimatePayRegression(hours).toFixedDecimal();
	}
	var total = 0;
	for (m in table) {
		total += table[m];
	}
	table["total"] = total.toFixedDecimal();
	console.log(
		"Projected Income Based on an average of",
		avg_days_missed.toFixedDecimal(),
		"days missed"
	);
	console.table(table);
}
async function processCommand(input) {
	history = await getHistory();
	schedule = await getSchedule();
	var tokens = input.split(" "),
		command = tokens[0];
	switch (command) {
		case "r":
		case "report":
			printReport();
			break;
		case "e":
		case "estimate":
			if (tokens[1]) {
				console.log(
					"Simple Estimate:",
					estimatePay(parseFloat(tokens[1]))
				);
				console.log(
					"Regression Estimate:",
					estimatePayRegression(parseFloat(tokens[1]))
				);
			} else {
				getEstimate();
			}
			break;
		case "c":
		case "create":
			var month = null,
				year = null,
				pay = null,
				hours = null;
			process.stdin.removeListener("data", onInput);
			process.stdin.addListener("data", async function processNewEntry(
				data
			) {
				data = data
					.toString()
					.trim()
					.replace("\r\n", "");
				if (month == null) {
					month = data;
					console.log("Year:");
				} else if (year == null) {
					year = data;
					console.log("Pay:");
				} else if (pay == null) {
					pay = parseFloat(data);
					console.log("Hours:");
				} else {
					hours = parseInt(data);
					await createEntry(month, year, pay, hours);
					console.log(
						"Inserted",
						JSON.stringify({ month, year, pay, hours })
					);
					process.stdin.removeListener("data", processNewEntry);
					process.stdin.addListener("data", onInput);
				}
			});
			console.log("Month:");
			break;
		case "p":
		case "project":
			if (tokens[1]) projectYear(parseInt(tokens[1]));
			else projectYear();
			return;
		default:
			printHelp();
			break;
	}
}

function onInput(data) {
	processCommand(
		data
			.toString()
			.trim()
			.replace("\n", "")
	);
}

var history, schedule;
async function run() {
	history = await getHistory();
	process.stdin.addListener("data", onInput);
	printHelp();
}

run();
