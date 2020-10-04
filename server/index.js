const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
// const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(morgan("dev"));

app.get("*", (req, res, next) => {
	res.sendFile(path.join(__dirname, "../index.html"));
});

app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});
app.use((err, req, res, next) => {
	res.status(err.status || 500).send(err.message || "Internal server error");
	console.error(err);
});
app.listen(3000, () => {
	console.log(`Hurry! class is starting @ Port 3000`);
});
