"use strict";

// App Modules
// =========================
var Config 		= require('./config.js');


// Express Application
// =========================
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
    app.use(bodyParser.json());


// Kaleboo
// =========================	
var Kaleboo	= require('../index.js');

	Kaleboo.verbose(true);
	Kaleboo.automatically(Config.Database, Config.Server, app);
