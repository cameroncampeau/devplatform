var router = require("express").Router(),
	Dog = require("./controllers/dog"),
	path = require("path");

router.get("/", (req, res) =>
	res.sendFile(path.resolve(__dirname + "/index.html"))
);

router.get("/api/dog", async (req, res) => {
	res.json(await Dog.get());
});

module.exports = router;
