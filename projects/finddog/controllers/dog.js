var rp = require("request-promise"),
	fs = require("fs").promises,
	path = require("path"),
	cheerio = require("cheerio");

const ENDPOINT =
	"https://www.torontohumanesociety.com/api/api.php?action=getAnimalsForSpeciesId&id=1&stageId=2";

const db = {
	breed: path.resolve(__dirname + "/../db/breed.info.db.json"),
	dogs: path.resolve(__dirname + "/../db/dogs.db.json"),
	preferences: path.resolve(__dirname + "/../db/user.preferences.db.json")
};

function Profile() {
	return { favourites: [] };
}
/*
	Dogs

*/
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
async function favouriteDog(profile_name, dog) {
	var record = { dog, date: Date.now() };
	var preferences = await getPreferences();
	if (!preferences.profiles[profile_name])
		preferences.profiles[profile_name] = Profile();

	preferences.profiles[profile_name].favourites.push(record);
	await setPreferences(preferences);
}
async function unfavouriteDog(profile_name, dog) {
	var preferences = await getPreferences();

	var profile = preferences.profiles[profile_name];

	if (!profile) return;
	profile.favourites = profile.favourites.filter(
		favourite => favourite.dog != dog
	);

	await setPreferences(preferences);
}
async function saveDogDB(dogs) {
	await fs.writeFile(
		path.resolve(__dirname + "/../db/dogs.db.json"),
		JSON.stringify({ dogs, lastUpdated: Date.now() })
	);
}
/*
	Breeds
*/

const BREED_DETAILS_ENDPOINT = breed_name => {
	return "https://dogtime.com/dog-breeds/" + breed_name;
};

async function saveBreedDb(breeds) {
	return await fs.writeFile(db.breed, JSON.stringify(breeds));
}

async function getBreeds() {
	return JSON.parse((await fs.readFile(db.breed)).toString());
}

async function getAllBreedNames(force_fetch = false) {
	if (!force_fetch) {
		var breeds = await getBreeds();
		return Object.keys(breeds);
	}
	var $ = await rp({
		uri: BREED_DETAILS_ENDPOINT("golden-retriever"),
		transform: cheerio.load
	});
	var breed_names = [];
	$(".search-results-list.js-search-results-list li a").each((i, e) => {
		breed_names.push($(e).text());
	});
	return breed_names;
}
function wait(ms) {
	return new Promise((res, rej) => {
		setTimeout(res, ms);
	});
}
async function refreshBreedDb() {
	var breeds = {},
		breed_names = await getAllBreedNames(true);
	var promises = [];
	breed_names.forEach(async (b, i) => {
		if (i % 20 == 0) await wait(1000);
		b = b.split(" ").join("-");
		if (
			["Korean-Jindo-Dog", "Xoloitzcuintli", "Cirneco-dell’Etna"].indexOf(
				b
			) > -1
		)
			return;
		promises.push(
			getBreedDetails(b, true, false).catch(e => {
				console.error(b, "ERROR\n");
				return {};
			})
		);
		return;
	});
	var breed_info = await Promise.all(promises);

	breed_info.forEach((b, i) => {
		breeds[breed_names[i]] = b;
	});

	await saveBreedDb(breeds);
}

async function getBreedDetails(breed_name, force_fetch = false, save = true) {
	async function fetchFromSite() {
		const DETAIL_SELECTOR = ".js-list-item.child-characteristic",
			DETAIL_TITLE_SELECTOR = ".characteristic-title",
			DETAIL_STAR_SELECTOR = ".characteristic-star-block div.star",
			DETAIL_DESCRIPTION_SELECTOR = ".characteristic-description > p";
		function getDetailObj($el) {
			var title = $el.find(DETAIL_TITLE_SELECTOR).text(),
				$starEl = $el.find(DETAIL_STAR_SELECTOR),
				description = $el.find(DETAIL_DESCRIPTION_SELECTOR).text();
			var starClasses = $starEl.attr("class");

			var stars =
				parseInt(starClasses[starClasses.indexOf("star-") + 5]) || 0;
			return {
				title,
				stars,
				description
			};
		}
		var $ = await rp({
			uri: BREED_DETAILS_ENDPOINT(breed_name),
			transform: cheerio.load
		});
		var details = {
			stats: []
		};
		$(DETAIL_SELECTOR).each((i, e) => {
			details.stats.push(getDetailObj($(e)));
		});
		return details;
	}
	if (save || !force_fetch) {
		var breeds = await getBreeds();
		if (!force_fetch && breed_name in breeds) return breeds[breed_name];
	}

	var breed = await fetchFromSite();
	if (save) {
		breeds[breed_name] = breed;
		await saveBreedDb(breeds);
	}
	return breed;
}
/*
	User Preferences/Profiles

*/
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

async function getProfile(name) {
	var preferences = await getPreferences();
	return preferences.profiles[name] || Profile();
}

module.exports = {
	get,
	saveDogDB,
	favouriteDog,
	unfavouriteDog,
	getProfile,
	getAllBreedNames,
	getBreedDetails
};
