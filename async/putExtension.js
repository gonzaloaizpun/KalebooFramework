"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var validateId = require('./validations/id.js');
var Table = require('../core/table.js');


var main = function(route, database, request, callback) 
{
	validateId(request, function(error, id) 
	{
		if (error) {
			return end(callback, error, null);
		}

		var table = route.model.table;
		if (route.isByExtension()) {
			table = Table.reverseExtension(route.model.table, request.url, id);
		}	

		database.query(makeQuery(table, request.body, id), function(error, results) 
		{
			if (error) {
				return end(callback, error, results);
			} else {
				var result = {
					message : `item ${id} updated in ${table}`,
					     id : id,
					  table : table
				}
				return end(callback, null, result);
			}
			
		});

	});
}


	var makeQuery = function(table, body, id) 
	{
		var keyvals = [];

		Object.keys(body).forEach(function(key) 
		{
			var str = body[key];
			if (isNaN(body[key])) {
				str = body[key].replace(`"`, `\"`);
			}
			keyvals.push(`${key} = "${str}"`);
		});

		return `UPDATE ${table} SET ${keyvals.join()} WHERE id = ${id}`;
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;