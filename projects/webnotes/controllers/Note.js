var DefaultDb = require("../../../DefaultDB");

const ViewLink = require("./ViewLink");
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
	var note = await DefaultDb.getCollection(NOTE_COLLECTION_NAME).findOne({
		_id: id
	});
	var note_links = await ViewLink.getByNote(id);
	note.links = note_links;
	return note; 
}
module.exports = { create, get, getByCreator, updateBody };
