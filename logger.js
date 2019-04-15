"use strict";

// External Modules
var colors = require('colors');

class Logger
{
	constructor() {
		this.verbose = false;
	}

	ExpressGetRoute(msg) {
		this.PrintOut(`\t✔ `.yellow + 'GET ' + msg.yellow + ' created.');
	}

	NewModel(msg) {
	    this.PrintOut(`\t✔ `.green + 'Model ' + msg.green + ' created.');
	}

	model(msg, hasOne, hasMany, hasExternal) 
	{
	    this.PrintOut(`\t✔ `.green + 'Model ' + msg.green + ' discovered.');
	    var logger = this;
	
	    if (Array.isArray(hasOne) && hasOne.length > 0) {
	    	hasOne.forEach(function(element) {
				logger.PrintOut(`\t\t has 1 dependency with ` + `${element}`.yellow);
	    	});
	    }

	    if (Array.isArray(hasMany) && hasMany.length > 0) {
	    	hasMany.forEach(function(element) {
				logger.PrintOut(`\t\t has many dependencies with ` + `${element}`.yellow);
	    	});
	    }

	    if (Array.isArray(hasExternal) && hasExternal.length > 0) {
	    	hasExternal.forEach(function(element) {
				logger.PrintOut(`\t\t has 1 external relationship with ` + `${element}`.yellow);
	    	});
	    }
	}

	Hello() {
	    this.PrintOut('\n' + 'Hello! Kaleboo framework was successfully loaded.'.yellow + '\n');
	}

	PrintOut(str) {
		if (this.verbose) {
			console.log(str);
		}
	}

	Verbose(option) {
		this.verbose = (option == true);
	}
}



module.exports = new Logger();