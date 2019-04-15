"use strict";

// Libraries
var Async 	  = require('async');
var Tables    = require('./tables.js');
var Model     = require('./model.js');
var Routes    = require('./routes.js');

var Database  = require('../utilities/database.js');

class Autodiscover
{
	constructor(db_config, logger) 
	{
		this.mysql  = new Database(db_config);
		this.tables = new Tables(db_config);
		this.db_config = db_config;
		this.logger = logger;
		this.logger.hello();
	}

	run(callback) 
	{
		// I am an autodiscover
		var autodiscover = this;

		// the expected result of this method
		var data = {
			models : [],
			routes : []
		};

		// Go for the models!
		autodiscover.discoverModels(function (error, results)
		{
			data.models = results;

			// Go for the routes!
			autodiscover.discoverRoutes(autodiscover, data.models, function (error, results) 
			{
				data.routes = results;

				// bye!
				autodiscover.end(callback, error, data);
			});
		});
	}

	discoverModels(callback)
	{
		// Variables with scope for child processes
		var autodiscover = this;
		var functions 	 = [this.init];

		// hello!
		autodiscover.logger.sectionModels();

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
					functions.push(Async.apply(autodiscover.model, table, results.tables, autodiscover.db_config, autodiscover.logger));
				}
			});

			// Make each Model in async way
		    Async.waterfall(functions, function(error, results) {
		        callback(error, results);
		    });
		});
	}

		model(table, tables, db_config, logger, queue, callback) 
		{
			let model = new Model();

				model.make(table, tables, db_config, logger, function (error, results) {
					queue.push(results);
					callback(null, queue);
				});
		}

	discoverRoutes(autodiscover, models, callback)
	{
		// hello!
		autodiscover.logger.sectionRoutes();

		var results = [];
		
		models.forEach(function(model) {
			results.push(new Routes(model, autodiscover.logger).list());
		});

		callback(null, results);
	}


	init(callback) {
		callback(null, []);
	}

	end(callback, error, queue) {
		return callback(error, queue);
	}
}

module.exports = Autodiscover;