"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');


var main = function(route, db_config, request, callback) 
{
    let id = request.params.id || 0;

    if (id == 0) {
    	let error = new KalebooError(`Mmm... it looks like 'id' property do not exists in the request`);
    	return end(callback, error, null);
    }

    if (isNaN(id)) {
    	let error = new KalebooError(`Mmm... it looks like ${id} is not a valid id`);
    	return end(callback, error, null);
    }


	// Go go go! We have green light to proceed.
	// ==============================================
	let connection = mysql.createConnection(db_config);
	let query = makeQuery(route, id);

	connection.query(query, function(error, results) 
	{
		if (error) {
			return end(callback, error, results);
		} else {
			var result = {
				message : `item ${id} removed from ${route.model.table}`,
				     id : id,
				  table : route.model.table
			}
			return end(callback, null, result);
		}
		
	});
}


	var makeQuery = function(route, id) 
	{
		if (route.model.deleteByDisable) {
			return `UPDATE ${route.model.table} SET active = 0 WHERE id = ${id}`;
		} else {
			return `DELETE FROM ${route.model.table} WHERE id = ${id}`;
		}
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;