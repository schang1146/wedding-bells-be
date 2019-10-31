//Instantiate Express, Cors, helmet, express-session, connect-session-knex,express for nodeJS
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const server = express();

const usersRouter = require("../routes/userRouter");
const vendorsRouter = require("../routes/vendorRouter");
const weddingsRouter = require("../routes/weddingRouter");
const guestsRouter = require("../routes/guestsRouter");

//Import the secrets file for jsonwebtoken here
const secrets = require("../config/secrets.js");

//Import middleware to be used on routes for authentication here
const { restricted } = require("../middleware");

//Insert Session options here
const sessionOptions = {
	name: "#{name of cookie for sessionOptions in server.js",
	secret: secrets.jwtSecret,
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false,
		httpOnly: true,
	},
	resave: false,
	saveUninitialized: false,

	store: new knexSessionStore({
		knex: require("../database/config"),
		tablename: "sessions",
		sidfieldname: "sid",
		createtable: true,
		clearInterval: 1000 * 60 * 60,
	}),
};

//All routes will use the following express packages
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

// Route for Users
server.use("/api/users", usersRouter);
server.use("/api/vendors", vendorsRouter);
server.use("/api/weddings", weddingsRouter);
server.use("/api/guests", guestsRouter);

//This is what is shown from the backend when you go to the localhost:5000/
server.get("/", (req, res) => {
	res.send("Welcome to the Wedding Bells Back End Repo");
});

module.exports = server;
