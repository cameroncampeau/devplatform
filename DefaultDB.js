var diskdb = require("diskdb"),
  path = require("path");

db = diskdb.connect(path.resolve(__dirname + "/db"));

function loadCollection(collectionName) {
  db.loadCollections([collectionName]);
}

function saveItem(collection, item) {
  if (!(collection in db)) {
    throw new Error("Collection " + collection + " not found");
  }
  db[collection].save(item);
}

function getCollection(collectionName) {
  return db[collectionName];
}
module.exports = { loadCollection, getCollection, saveItem };
