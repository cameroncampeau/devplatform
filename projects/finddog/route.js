var router = require("express").Router(),
	Dog = require("./controllers/dog"),
	path = require("path");

router.get("/", (req, res) =>
	res.sendFile(path.resolve(__dirname + "/index.html"))
);

router.get("/api/dog", async (req, res) => {
	res.json(await Dog.get());
});

router.get("/api/profile/:name", async (req, res) => {
	try {
		res.json({ profile: await Dog.getProfile(req.params.name) });
	} catch (e) {
		console.error(e);
		res.status(500).end("Server Error");
	}
});

router.post("/api/profile/:name/favourite/:dog_id", async (req, res) => {
	try {
		await Dog.favouriteDog(req.params.name, req.params.dog_id);
		res.json({ error: false });
	} catch (e) {
		console.error(e);
		res.status(500).end("Server Error");
	}
});
module.exports = router;
