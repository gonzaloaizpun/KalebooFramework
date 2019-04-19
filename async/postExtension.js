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

		var prefix = route.model.table.slice(0, -1);
		var sufix = request.url.substring(request.url.lastIndexOf("/") + 1);

		// data is composed by request.body + the relationship (request query param)
		var data = request.body;
			data[`id_${prefix}`] = id;

		// table is a child of this route...
		var table = `${prefix}_${sufix}`;
		

		mysql.createConnection(db_config).query(makeQuery(table, data), function(error, results) 
		{
			if (error) {
				return end(callback, error, results);
			} else {
				var result = {
					message : `item ${results.insertId} created in ${table}`,
					     id : results.insertId,
					  table : table
				}
				return end(callback, null, result);
			}
			
		});

	});
}


	var makeQuery = function(table, body) 
	{
		var keys = ['id'].concat(Object.keys(body)).join();
		var values = ["NULL"];

		Object.keys(body).forEach(function(key) 
		{
			var str = body[key];
			if (isNaN(body[key])) {
				str = body[key].replace(`"`, `\"`);
			}
			values.push(`"${str}"`);
		});

		return `INSERT INTO ${table} (${keys}) VALUES (${values})`;
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;