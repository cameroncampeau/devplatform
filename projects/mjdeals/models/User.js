const mongoose = require("mongoose");

var schema = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  creationDate: {
    type: Date
  }
});

module.exports = mongoose.model("User", schema);
