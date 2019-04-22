"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var validateInputs = require('./validations/inputs.js');
var validateId = require('./validations/id.js');


var main = function(route, database, request, callback) 
{
	validateId(request, function(error, id) 
	{
		if (error) {
			return end(callback, error, null);
		}

	    validateInputs(route, request.body, false, function(error, results)
	    {
	    	if (error) {
	    		return end(callback, error, null);
	    	}

			database.query(makeQuery(route, request.body, id), function(error, results) 
			{
				if (error) {
					return end(callback, error, results);
				} else {
					var result = {
						message : `item ${id} updated in ${route.model.table}`,
						     id : id,
						  table : route.model.table
					}
					return end(callback, null, result);
				}
				
			});
	    });

	});

}


	var makeQuery = function(route, body, id) 
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
		
		return `UPDATE ${route.model.table} SET ${keyvals.join()} WHERE id = ${id}`;
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;