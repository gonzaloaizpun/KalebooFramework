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