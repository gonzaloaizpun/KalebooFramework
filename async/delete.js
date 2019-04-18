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

		mysql.createConnection(db_config).query(makeQuery(route, id), function(error, results) 
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