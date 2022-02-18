// External modules
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import adminRouter from './routes/admin.js';
import usersRouter from './routes/users.js';

import * as db from './db/DB.js';
import * as path from 'path'

import dnv from 'dotenv'


try {

	dnv.config(); //for access tokens
	const reExt = /\.([a-z]+)/i;

	const app = express()
	let port = 2718;

	function content_type_from_extension(url) {
		const m = url.match(reExt);
		if (!m) return 'application/json'
		const ext = m[1].toLowerCase();

		switch (ext) {
			case 'js': return 'text/javascript';
			case 'css': return 'text/css';
			case 'html': return 'text/html'
		}
		return 'text/plain';
	}
	// General app settings

	const JSONSetContentFormat = "application/json; charset=utf-8";
	const set_content_type = function (req, res, next) {
		const content_type = req.baseUrl == 'api' ? JSONSetContentFormat : content_type_from_extension(req.url);
		res.setHeader("Content-Type", content_type);
		next(); //TEST 
	}

	app.use(set_content_type);
	app.use(express.json());  // to support JSON-encoded bodies
	app.use(express.urlencoded( // to support URL-encoded bodies
		{
			extended: true
		}));

	app.use("/api/users", usersRouter);
	app.use("/api/admin", adminRouter);

	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, 'pages')));
	await db.readData();
	await db.MakeAdmin();

	// Init 
	let msg = `server is listening at port ${port}`
	app.listen(port, () => { })
	console.log(msg);
}
catch (e) {
	console.log(e);
}
finally {

}





