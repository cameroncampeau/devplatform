const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    start: { type: Date },
    end: { type: Date },
    posted: { type: Date }
  },
  url: {
    type: String
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "DealCategory" }],
  upvotes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Deal", schema);
