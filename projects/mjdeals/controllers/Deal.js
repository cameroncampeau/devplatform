const Deal = require("../models/Deal"),
  DealCategory = require("../models/DealCategory");

async function create(
  title,
  description,
  url,
  thumbnail_url,
  categories,
  start,
  end
) {
  var deal = new Deal({
    title,
    description,
    url,
    thumb_url: thumbnail_url,
    upvotes: 0,
    categories,
    date: { start, end, posted: new Date() }
  });
  await deal.save();
  return deal;
}

async function createCategory(name) {
  var category = new DealCategory({ name });
  await category.save();
  return category;
}

async function get(sort, limit = 10, query = {}) {
  if (!sort) sort = { "date.posted": -1 };

  return Deal.find(query)
    .limit(limit)
    .sort(sort)
    .populate("categories")
    .lean()
    .exec();
}

async function getById(id) {
  return Deal.findOne({ _id: id })
    .populate("categories")
    .lean()
    .exec();
}

async function getCategories() {
  return DealCategory.find().exec();
}

async function upvote(dealID) {
  var deal = await Deal.findOne({ _id: dealID }).exec();
  if (!deal) return false;
  deal.upvotes++;
  await deal.save();

  return true;
}

async function update(
  dealId,
  title,
  description,
  thumb_url,
  categories,
  start,
  end
) {
  var deal = await Deal.findOne({ _id: dealId }).exec();
  deal.title = title;
  deal.description = description;
  deal.thumb_url = thumb_url;
  deal.categories = categories;
  deal.date.start = start;
  deal.date.end = end;

  await deal.save();
  return deal;
}

async function remove(dealId) {
  return await Deal.findByIdAndRemove(dealId).exec();
}

module.exports = {
  create,
  createCategory,
  get,
  getById,
  getCategories,
  upvote,
  update,
  remove
};
