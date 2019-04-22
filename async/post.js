"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var validateInputs = require('./validations/inputs.js');


var main = function(route, database, request, callback) 
{
    validateInputs(route, request.body, true, function(error, results)
    {
    	if (error) {
    		return end(callback, error, null);
    	}

		database.query(makeQuery(route, request.body), function(error, results) 
		{
			if (error) {
				return end(callback, error, results);
			} else {
				var result = {
					message : `item ${results.insertId} created in ${route.model.table}`,
					     id : results.insertId,
					  table : route.model.table
				}
				return end(callback, null, result);
			}
			
		});
    });
}


	var makeQuery = function(route, body) 
	{
		var keys = ['id'].concat(route.model.filleable).join();
		var values = ["NULL"];

		Object.keys(body).forEach(function(key) 
		{
			var str = body[key];
			if (isNaN(body[key])) {
				str = body[key].replace(`"`, `\"`);
			}
			values.push(`"${str}"`);
		});
		
		return `INSERT INTO ${route.model.table} (${keys}) VALUES (${values})`;
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;