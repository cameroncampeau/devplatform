var User = require("../models/User"),
  crypto = require("crypto");

function hash(str) {
  return crypto
    .createHash("sha256")
    .update(str)
    .digest("hex");
}

async function create(username, password, name) {
  password = hash(password);
  var user = new User({ username, password, name, creationDate: new Date() });
  await user.save();
  return { username, name };
}

async function login(username, password) {
  console.log("login", username, password, hash(password));
  return await User.findOne({ username, password: hash(password) })
    .lean()
    .exec();
}

module.exports = { create, login };
