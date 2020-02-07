const COLLECTION_NAME = "md-web-view-link";

var DefaultDb = require("../../../DefaultDB");
DefaultDb.loadCollection(COLLECTION_NAME);

async function create(key, note_id) {
    DefaultDb.saveItem(COLLECTION_NAME, {key, note: note_id})
}
async function get(key) {
    return await DefaultDb.getCollection(COLLECTION_NAME).findOne({key})
}
create("dog", "174714b6701749ddab8bd08afa8ed240")

module.exports = {create, get}