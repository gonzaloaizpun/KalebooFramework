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


// Kaleboo Models and Routes
// =========================
Kaleboo.model('devices').with('device_types');
Kaleboo.model('silobags').with('silobag_types').has('devices');
Kaleboo.model('measurements').with(['devices', 'metrics', 'units']);

Kaleboo.model('lots').has(['attributes', 'silobags']);
Kaleboo.model('countrysides').has(['attributes', 'lots']);
Kaleboo.model('organizations').has(['attributes', 'countrysides', 'owners', 'products']);
Kaleboo.model('users').has(['attributes', 'permissions']);

Kaleboo.model('metrics');
Kaleboo.model('units');
Kaleboo.model('attributes');
Kaleboo.model('device_types');
Kaleboo.model('permissions');
Kaleboo.model('products');
Kaleboo.model('silobag_types');

Kaleboo.database(Config.Database);
Kaleboo.routes(app);


// Start Server!
// =========================
app.listen(Config.Server.Port, () => console.log('\n' + Config.Server.Message))

