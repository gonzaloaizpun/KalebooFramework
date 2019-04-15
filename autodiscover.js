"use strict";

// Libraries
var Async 	  = require('async');
var Database  = require('./database.js');
var Tables    = require('./tables.js');
var Model     = require('./model.js');


class Autodiscover
{
	constructor(db_config, logger) 
	{
		this.mysql  = new Database(db_config);
		this.tables = new Tables(db_config);
		this.db_config = db_config;
		this.logger = logger;
		this.logger.Hello();
	}

	run(callback) 
	{
		// Variables with scope for child processes
		var autodiscover = this;
		var functions 	 = [this.init];

		// Get all tables in database
		autodiscover.tables.list(function(error, results) 
		{
			// Iterate each table in order to enqueue a Model
			results.tables.forEach(function(table) 
			{
				// Model does not contains "_"
				if (!table.includes("_")) 
				{
					// Enqueue Model class in order to be discovered
					functions.push(Async.apply(Model.make, table, results.tables, autodiscover.db_config, autodiscover.logger));
				}
			});

			// Make each Model in async way
			autodiscover.models(functions, callback);
		});
	}

	models(functions, callback) 
	{
	    Async.parallel(functions, function(error, results) {
	        end(callback, error, results);
	    });
	}

	init(callback) {
		callback(null, {});
	}

	end(callback, error, queue) {
		return callback(error, queue);
	}
}

module.exports = Autodiscover;