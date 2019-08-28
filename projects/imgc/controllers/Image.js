const fs = require("fs"),
    path = require("path"),
    db = require("./../../../DefaultDB"),
    EXTENSIONS = ["bmp", "jpg", "jpeg", "png"],
    COLLECTION_NAME = "Image";


db.loadCollection(COLLECTION_NAME)

var Jimp = require('jimp');


const IMAGE_DIR = {
    raw: path.resolve(__dirname + "/../images/raw") + "/",
    processed: path.resolve(__dirname + "/../images/processed") + "/"
}

function getRandomImageName() {
    return Math.random()
      .toString(36)
      .substring(7);
}

function createRecord(image) {
    return db.saveItem(COLLECTION_NAME, image);
}


async function convertTo(file, imageType) {
    var ext = path.extname(file.originalname);
    if (!EXTENSIONS.find((i) => i == imageType)) throw new Error(imageType + " is not a valid image conversion type");
    if (!EXTENSIONS.find((i) => i == ext.substring(1).toLowerCase())) throw new Error(ext + " is not a valid image type");
    var img = await Jimp.read(IMAGE_DIR.raw + file.filename);
    await img.write(IMAGE_DIR.processed + file.filename + "." + imageType);
    var file = await db.getCollection(COLLECTION_NAME).findOne({filename: file.filename});
    db.getCollection(COLLECTION_NAME).update({_id: file._id}, {processedType: imageType})
    return file;
}

async function get(filename) {
    return await db.getCollection(COLLECTION_NAME).findOne({filename})
}

module.exports = {create:createRecord, convertTo, get}