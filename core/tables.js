"use strict";

var Async 	 = require('async');
var Database = require('../utilities/database.js');

var mysql 	 = null;


class Tables
{
	constructor(db_config) {
		mysql = new Database(db_config);
	}

	list(callback) 
	{
	    Async.waterfall([
	        
	        this.init,
	        this.showtables,

	    ], (error, results) => this.end(callback, error, results));
	}

	showtables(queue, callback)
	{
		let query = `SHOW TABLES;`;

		mysql.query(query, function(error, results) 
		{
			queue.tables = [];
			results.forEach(function(element) {
				queue.tables.push(Object.values(element)[0]);
			});
			callback(error, queue);
		});
	}

	init(callback) {
		callback(null, {});
	}

	end(callback, error, queue) {
		return callback(error, queue);
	}
}

module.exports = Tables;