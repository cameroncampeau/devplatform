const COLLECTION_NAME = "md-web-view-link";

var DefaultDb = require("../../../DefaultDB");
DefaultDb.loadCollection(COLLECTION_NAME);

async function create(key, note_id) {
    DefaultDb.saveItem(COLLECTION_NAME, {key, note: note_id})
}
async function get(key) {
    return await DefaultDb.getCollection(COLLECTION_NAME).findOne({key})
}

module.exports = {create, get}