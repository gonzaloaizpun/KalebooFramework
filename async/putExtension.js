"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var validateId = require('./validations/id.js');


var main = function(route, db_config, request, callback) 
{
	validateId(request, function(error, id) 
	{
		if (error) {
			return end(callback, error, null);
		}

		var table = route.model.table;
		if (route.isByExtension()) 
		{
			//  "/organizations/1/attributes/10" to "/organizations/1/attributes"
			let url = request.url.replace(`/${id}`, '');
			//  "/organizations/1/attributes" to "organization"
			let prefix = route.model.table.slice(0, -1);
			//  "/organizations/1/attributes" to "attributes"
			let sufix = url.substring(url.lastIndexOf("/") + 1);
			// "organization_attributes"
			table = `${prefix}_${sufix}`;
		}
		

		mysql.createConnection(db_config).query(makeQuery(table, request.body, id), function(error, results) 
		{
			if (error) {
				return end(callback, error, results);
			} else {
				var result = {
					message : `item ${results.insertId} updated in ${table}`,
					     id : results.insertId,
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