var DefaultDb = require("../../../DefaultDB");

const NOTE_COLLECTION_NAME = "md-web-notes";

DefaultDb.loadCollection(NOTE_COLLECTION_NAME);

async function create(creator, title, body) {
	var doc = { creator, title, body };
	await DefaultDb.saveItem(NOTE_COLLECTION_NAME, doc);
	return doc;
}

async function updateBody(id, body) {
	await DefaultDb.getCollection(NOTE_COLLECTION_NAME).update(
		{ _id: id },
		{ body }
	);
}

async function getByCreator(creator) {
	return await DefaultDb.getCollection(NOTE_COLLECTION_NAME).find({
		creator
	});
}

async function get(id) {
	return await DefaultDb.getCollection(NOTE_COLLECTION_NAME).findOne({
		_id: id
	});
}
module.exports = { create, get, getByCreator, updateBody };
