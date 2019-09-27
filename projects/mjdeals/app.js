const express = require("express"),
  app = express(),
  routes = {
    public: require("./routes/public"),
    api: require("./routes/api")
  },
  mongoose = require("mongoose");

function setupApp() {
  app.use("/api", routes.api);
  app.use("/", routes.public);
}

// Account cameron.campeau@gmail.com
const DB_CREDENTIALS = {
  username: "admin",
  password: "2i2md5hneD3G3f1J"
};

DB_CREDENTIALS.url =
  "mongodb+srv://" +
  DB_CREDENTIALS.username +
  ":" +
  DB_CREDENTIALS.password +
  "@mjdeals-a1sfx.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(DB_CREDENTIALS.url, err => {
  if (err) return console.error(err);
});
mongoose.connection.on("connected", () => {
  setupApp();
  app.listen(80);
});
