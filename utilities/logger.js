"use strict";

// External Modules
var colors = require('colors');
var Route  = require('../core/route.js');

class Logger
{
	constructor() {
		this.verbose = false;
	}

	routes(items) 
	{
		var logger = this;

	    if (Array.isArray(items) && items.length > 0) {
	    	items.forEach(function(route) 
	    	{
	    		var method = '   GET';

	    		if (route.method == Route.http.post) {
	    			method = '  POST';
	    		} else if (route.method == Route.http.delete) {
	    			method = 'DELETE';
	    		} else if  (route.method == Route.http.put) {
	    			method = '   PUT';
	    		}

				logger.print(`\t✔   `.magenta + `${method}  ` + route.url.magenta + ' created.');
	    	});
	    }
	}

	model(msg, hasOne, hasMany, hasExternal) 
	{
	    this.print(`\t✔ `.green + 'Model ' + msg.green + ' discovered.');
	    var logger = this;
	
	    if (Array.isArray(hasOne) && hasOne.length > 0) {
	    	hasOne.forEach(function(element) {
				logger.print(`\t\t has 1 dependency with ` + `${element}`.yellow);
	    	});
	    }

	    if (Array.isArray(hasMany) && hasMany.length > 0) {
	    	hasMany.forEach(function(element) {
				logger.print(`\t\t has many dependencies with ` + `${element}`.yellow);
	    	});
	    }

	    if (Array.isArray(hasExternal) && hasExternal.length > 0) {
	    	hasExternal.forEach(function(element) {
				logger.print(`\t\t has 1 external relationship with ` + `${element}`.yellow);
	    	});
	    }
	}

	serverStarted(port) {
		this.print(`\n• Express Server started in :${port}`.yellow);
	}

	hello() {
	    this.print('\n' + 'Hello! Kaleboo framework was successfully loaded.'.yellow + '\n');
	}

	print(str) {
		if (this.verbose) {
			console.log(str);
		}
	}

	sectionRoutes() {
		this.print(`\nTrying to find and assign expressJs routes...\n`);
	}

	sectionModels() {
		this.print(`\nTrying to find models from mysql...\n`);
	}

	enabled(option) {
		this.verbose = (option == true);
	}
}



module.exports = new Logger();