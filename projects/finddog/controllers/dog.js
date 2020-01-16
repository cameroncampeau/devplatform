var rp = require("request-promise"),
	fs = require("fs").promises,
	path = require("path");

const ENDPOINT =
	"https://www.torontohumanesociety.com/api/api.php?action=getAnimalsForSpeciesId&id=1&stageId=2";

function Profile() {
	return { favourites: [] };
}

async function get(force_refresh = false) {
	async function fetchDogs() {
		return await rp({
			uri: ENDPOINT,
			transform: body => {
				body = JSON.parse(body);
				body = body.AdoptableSearchResult.XmlNode.filter(
					d => d != null
				);
				return body.map(d => d.adoptableSearch);
			}
		});
	}
	if (force_refresh) return await fetchDogs();
	try {
		var dogs = await fs.readFile(__dirname + "/../db/dogs.db.json");
		dogs = JSON.parse(dogs);
		if (Date.now() - dogs.lastUpdated > 24 * 60 * 60 * 1000)
			return await fetchDogs();
		return dogs.dogs;
	} catch (e) {
		return await fetchDogs();
	}
}
async function saveDogDB(dogs) {
	await fs.writeFile(
		path.resolve(__dirname + "/../db/dogs.db.json"),
		JSON.stringify({ dogs, lastUpdated: Date.now() })
	);
}

async function getPreferences() {
	var preferences = await fs.readFile(
		path.resolve(__dirname + "/../db/user.preferences.json")
	);
	preferences = JSON.parse(preferences);
	return preferences;
}

async function setPreferences(preferences) {
	return await fs.writeFile(
		path.resolve(__dirname + "/../db/user.preferences.json"),
		JSON.stringify(preferences)
	);
}

async function favouriteDog(profile_name, dog) {
	var record = { dog, date: Date.now() };
	var preferences = await getPreferences();
	if (!preferences.profiles[profile_name])
		preferences.profiles[profile_name] = Profile();

	preferences.profiles[profile_name].favourites.push(record);
	await setPreferences(preferences);
}
async function getProfile(name) {
	var preferences = await getPreferences();
	return preferences.profiles[name] || Profile();
}

module.exports = { get, saveDogDB, favouriteDog, getProfile };
