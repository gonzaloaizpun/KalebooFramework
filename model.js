"use strict";

var Async 	 = require('async');
var Database = require('./database.js');
var mysql 	 = null;


class Model
{
	construct() {
		this.db_config = null;
		this.hasOne = null;
		this.hasMany = null;
		this.hasExternal = null;
		this.table = null;
		this.logger = null;
	}

	make(table, tables, db_config, logger, queue, callback) 
	{
		// Libraries
		var mysql = new Database(db_config);
		
		var model = this;
		
		if (model == null) {
			model = new Model();
		}

		// local objects
		var children = [];
		var hasOne   = [];
		var hasMany  = [];
		var hasExternal = [];

		// get the children
		model.children(table, tables, function(error, results) 
		{
			children = results;

			// get 1:1 and 1:N extensions
		    model.extensions(model, mysql, table, children, function(error, results) 
		    {
		    	hasOne  = results.hasOne;
		    	hasMany = results.hasMany;

		    	model.relationships(mysql, table, function(error, items) {
		    		hasExternal = items;
		    		logger.model(table, hasOne, hasMany, hasExternal);
		    	});
		    });

		})

	    // Information
	    
	}

	children(table, tables, callback) 
	{
	    // We know Model children start with the following prefix: (ex. 'user_')
	    let prefix = table.slice(0, -1) + '_';

	    // Children
	    var children = [];
	    tables.forEach(function(candidate) 
	    {
	    	if (candidate.includes(prefix)) {
	    		children.push(candidate);
	    	}
	    });

	    callback(null, children);
	}


	// Those tables that starts with table_ (ex. 'user_attributes')
	extensions(model, mysql, table, children, callback)
	{
	    var id = 'id_' + table.slice(0, -1);
	    var functions = [model.init];

	    // Add each Async Function
	    children.forEach(function(child) {
	    	functions.push(Async.apply(model.fields, mysql, child, id));
	    });

	    // Execute Async
	    Async.waterfall(functions, function(error, results) {
	        callback(error, results);
	    });
	}


		fields(mysql, child, id, queue, callback)
		{
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

	// this table which contains "id_" relationships (ex. 'users' has 'id_role')
	relationships(mysql, table, callback)
	{
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

	end(callback, error, queue) {
		return callback(error, queue);
	}
}

module.exports = new Model();