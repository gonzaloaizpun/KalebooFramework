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
			var table = `${prefix}_${sufix}`;
		}

		mysql.createConnection(db_config).query(makeQuery(table, route.model.deleteByDisable, id), function(error, results) 
		{
			if (error) {
				return end(callback, error, results);
			} else {
				var result = {
					message : `item ${id} removed from ${table}`,
					     id : id,
					  table : table
				}
				return end(callback, null, result);
			}
			
		});

	});
}


	var makeQuery = function(table, deleteByDisable, id) 
	{
		if (deleteByDisable) {
			return `UPDATE ${table} SET active = 0 WHERE id = ${id}`;
		} else {
			return `DELETE FROM ${table} WHERE id = ${id}`;
		}
	}


var end = function(callback, error, results) {
    return callback(error, results);
}


module.exports = main;