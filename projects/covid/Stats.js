var rp = require("request-promise"),
	cheerio = require("cheerio"),
	fs = require("fs").promises,
	path = require("path");

const DATA_REFRESH_INTERVAL = 1000 * 60 * 60 * 3; // 3 hours
setInterval(getData, DATA_REFRESH_INTERVAL); // Refresh data every 2 hours

const RESOURCE_URL = "https://www.worldometers.info/coronavirus/";

async function get$() {
	return await rp({
		uri: RESOURCE_URL,
		transform: cheerio.load
	});
}

function getTableValues($, table_selector) {
	function getColumns() {
		var columns = [];
		$(table_selector + " thead th").each((i, e) => {
			columns.push(
				$(e)
					.text()
					.split(",")[0]
			);
		});
		return columns;
	}
	function getRows(columns) {
		var rows = [];
		$(table_selector + " tbody tr").each((i, e) => {
			var row = {};
			$(e)
				.find("td")
				.each((i, e) => {
					var value = $(e)
						.text()
						.trim();
					if (value == "") value = 0;
					else if (parseInt(value))
						value = parseInt(value.replace(",", ""));
					row[columns[i]] = value;
				});
			if (row.Country != "Total:") rows.push(row);
		});
		return rows;
	}
	var columns = getColumns();
	return { columns, rows: getRows(columns) };
}
const TABLE_SELECTOR = "table#main_table_countries_today";
async function fetchData() {
	var $ = await get$();
	return await getTableValues($, TABLE_SELECTOR);
}

function getSaveFileName(time) {
	return `covid-data-by-country-${time}.db.json`;
}
async function saveData(data) {
	return await fs.writeFile(
		path.resolve(__dirname + "/db/" + getSaveFileName(Date.now())),
		JSON.stringify(data)
	);
}

async function getSavedDbs() {
	return (await fs.readdir(path.resolve(__dirname + "/db"))).map(f =>
		parseInt(
			f
				.split("-")
				.pop()
				.replace(".db.json", "")
		)
	);
}
async function getDb(time) {
	return JSON.parse(
		(
			await fs.readFile(
				path.resolve(__dirname + "/db/" + getSaveFileName(time))
			)
		).toString()
	);
}
function mostRecentDb(DBs) {
	return Math.max.apply(this, DBs);
}
const simpleFit = require("simple-linear-regression");
const regression = require("regression");
function regressionAnalysis(Xs, Ys) {
	//return simpleFit(Xs, Ys);
	function mergeTwoArraysToTupleArray() {
		return Xs.map((x, i) => [x, Ys[i]]);
	}
	var merged_xys = mergeTwoArraysToTupleArray();
	return {
		linear: regression.linear(merged_xys).equation,
		exponential: regression.exponential(merged_xys).equation,
		logarithmic: regression.logarithmic(merged_xys).equation,
		power: regression.power(merged_xys).equation,
		polynomial: regression.polynomial(merged_xys).equation
	};
}
var regression_interval = 1000 * 60 * 60 * 24;
async function getDataProgressionStats(country=null, end_date=null) {
	function getAllTotals(data) {
		var totals = {};
		for (col of progression_columns) totals[col] = 0;
		for (row of data.rows) {
			for (col of progression_columns) {
				totals[col] += row[col];
			}
		}
		return totals;
	}
	function getAllCountryTotals(data, country) {
		return data.rows.find(row => row.Country == country);
	}
	var progression_columns = "TotalCases NewCases TotalDeaths ActiveCases NewDeaths Serious".split(
		" "
	);
	var saves = (await getSavedDbs()).sort((a, b) => {
		return a - b;
	});
	if (end_date) saves = saves.filter(save => save < end_date);
	var promises = [];
	for (save_time of saves) promises.push(getDb(save_time));
	var totals = (await Promise.all(promises)).map(saved_data => {
		if (country) return getAllCountryTotals(saved_data, country)
		else return getAllTotals(saved_data)
	}
	);

	var start_save = saves[0];
	var Xs = saves.map(s => (s - start_save) / regression_interval); 
	var regression_analysis = progression_columns.map(col => {
		return [
			col,
			regressionAnalysis(
				Xs,
				totals.map(t => t[col])
			)
		];
	});
	return { start: start_save, analysis: regression_analysis };
}
function regressionProject(regression_stats, x) {
	return regression_stats.a * x + regression_stats.b;
}
async function getData() {
	var saved_data = await getSavedDbs();
	var most_recent_db = Math.max(mostRecentDb(saved_data) || 0, 0);
	if (Date.now() - most_recent_db > DATA_REFRESH_INTERVAL) {
		var data = await fetchData();
		await saveData(data);
		return data;
	}
	return await getDb(most_recent_db);
}

function DataSet(data) {
	var { columns, rows } = data;
	function group_by(column) {
		var groups = {};
		for (row of rows) {
			if (!(row[column] in groups)) groups[column] = [];
			groups[column].push(row);
		}
		return groups;
	}
	function getCountry(name) {
		return rows.filter(r => r.Country == name);
	}
	return {
		view: { group_by },
		get: {
			rows: () => rows,
			columns: () => columns,
			country: getCountry
		}
	};
}

module.exports = { get: getData, getDataProgressionStats };
