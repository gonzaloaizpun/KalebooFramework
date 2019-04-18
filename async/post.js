"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');


var main = function(route, db_config, body, callback) 
{
	var inputs = Object.keys(body);
	var errorObject = null;


	// checking if the body has valid filleable attributes with a proper type
	// ==============================================
	inputs.forEach(function(key) 
	{
		if (route.model.filleable.indexOf(key) == -1) {
			errorObject = new KalebooError(`Mmm... it looks like ${key} if something we do not need`);
			return;
		} else if (key.indexOf('id_') > -1 && isNaN(body[key])) {
			errorObject = new KalebooError(`Mmm... it looks like ${key} : ${body[key]} is not a number`);
			return;
		}
	});

		// bye?
		if (errorObject) {
			return end(callback, errorObject, null);
		}



	// checking if all filleable attributes exists in the request
	// ==============================================
	route.model.filleable.forEach(function(key) 
	{
		if (inputs.indexOf(key) == -1) {
			errorObject = new KalebooError(`Mmm... we need ${key} in order to proccess your request. Did you forget it?`);
			return;
		}
	});

		// bye?
		if (errorObject) {
			return end(callback, errorObject, null);
		}



	// Go go go! We have green light to proceed.
	// ==============================================
	let connection 	= mysql.createConnection(db_config);
	let query = makeQuery(route, body);

	connection.query(query, function(error, results) 
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