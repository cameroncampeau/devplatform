var DefaultDb = require("../../../DefaultDB");
const USER_COLLECTION_NAME = "md-web-users";
DefaultDb.loadCollection(USER_COLLECTION_NAME);

const crypto = require("crypto");
function hash(val) {
	return crypto
		.createHash("md5")
		.update(val)
		.digest("hex");
}

async function login(username, password) {
	return await DefaultDb.getCollection(USER_COLLECTION_NAME).findOne({
		username,
		password: hash(password)
	});
}
async function create(username, password) {
	password = hash(password);
	await DefaultDb.saveItem(USER_COLLECTION_NAME, { username, password });
	return { username, password };
}
module.exports = { login, create };
