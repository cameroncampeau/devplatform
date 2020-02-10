const COLLECTION_NAME = "md-web-view-link";

var DefaultDb = require("../../../DefaultDB");
DefaultDb.loadCollection(COLLECTION_NAME);

async function create(key, note_id) {
    DefaultDb.saveItem(COLLECTION_NAME, {key, note: note_id})
}
async function get(key) {
    return await DefaultDb.getCollection(COLLECTION_NAME).findOne({key})
}

async function getByNote(note_id) {
    return await DefaultDb.getCollection(COLLECTION_NAME).find({note: note_id})
}

module.exports = {create, get,getByNote}