"use strict";

var Async = require('async');
var mysql = null;


class Tables
{
	constructor(database) {
		mysql = database;
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