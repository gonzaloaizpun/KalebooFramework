"use strict";

var Async 	 = require('async');
var Database = require('../utilities/database.js');
var mysql 	 = null;


class Model
{
	constructor() {
		this.db_config = null;
		this.hasOne = null;
		this.hasMany = null;
		this.hasExternal = null;
		this.table = null;
		this.logger = null;
	}

	make(table, tables, db_config, logger, callback) 
	{
		// Hello, I am a model
		var model = this;

		// local objects
		var hasOne   = [];
		var hasMany  = [];
		var hasExternal = [];

		// get the children: this will find all related tables (ex. 'users' > ['user_attributes'])
		model.children(table, tables, function(error, children) 
		{
			// get extensions: this will understand if each related table is 1:1 or 1:N extension
		    model.extensions(model, db_config, table, children, function(error, results) 
		    {
		    	hasOne  = results.hasOne;
		    	hasMany = results.hasMany;

		    	// get relationships: this will get 1:1 external relationships (ex. 'users' > ['roles'])
		    	model.relationships(db_config, table, function(error, items) 
		    	{
		    		hasExternal = items;

		    		// Finally
					model.db_config = db_config;
					model.hasOne = hasOne;
					model.hasMany = hasMany;
					model.hasExternal = hasExternal;
					model.table = table;
					model.logger = logger;

					// Debug
		    		logger.model(table, hasOne, hasMany, hasExternal);

		    		// bye!
		    		return model.end(callback, null, model);
		    	});
		    });

		})
	    
	}

	children(table, tables, callback) 
	{
	    // We know Model children start with the following prefix: (ex. 'user_')
	    let prefix = table.slice(0, -1) + '_';

	    var children = [];
	    tables.forEach(function(candidate) 
	    {
	    	if (candidate.includes(prefix)) {
	    		children.push(candidate);
	    	}
	    });

	    callback(null, children);
	}


	// thoses tables that starts with table_ (ex. 'user_attributes')
	extensions(model, db_config, table, children, callback)
	{
	    var id = 'id_' + table.slice(0, -1);
	    var functions = [model.init];

	    // Add each Async Function
	    children.forEach(function(child) {
	    	functions.push(Async.apply(model.fields, db_config, child, id));
	    });

	    // Execute Async
	    Async.waterfall(functions, function(error, results) {
	        callback(error, results);
	    });
	}


		fields(db_config, child, id, queue, callback)
		{
			var mysql = new Database(db_config);

		    	mysql.query(`SELECT * FROM ${child} LIMIT 1`, function(error, results, fields) 
		    	{
		    		var idFound = false;
		    		fields.forEach(function(field) {
		    			if (field.name == id) {
		    				idFound = true;
		    			}
		    		});

		    		if (idFound) {
						queue.hasMany.push(child);
		    			return callback(null, queue);
		    		} else {
					    queue.hasOne.push(child);
						return callback(null, queue);
		    		}
		    	});
		}

	// those tables which contains "id_" relationships (ex. 'users' has 'id_role')
	relationships(db_config, table, callback)
	{
		var mysql = new Database(db_config);

	    	mysql.query(`SELECT * FROM ${table} LIMIT 1`, function(error, results, fields) 
	    	{
	    		var myId = table.slice(0, -1);
	    		var hasOne = [];
	    		
	    		fields.forEach(function(field) 
	    		{
	    			if (field.name.includes("id_") && !field.name.includes(myId)) {
	    				let model = field.name.slice(3) + 's'; 	// going to plural, 'id_role' > 'roles'
	    				hasOne.push(model);	
	    			}
	    		});

				return callback(null, hasOne);
	    	});
	}

	init(callback) {
		callback(null, { hasOne : [], hasMany : [] });
	}

	end(callback, error, results) {
		return callback(error, results);
	}
}

module.exports = Model;