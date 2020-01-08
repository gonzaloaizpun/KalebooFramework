"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var validateId = require('./validations/id.js');


var main = function(route, database, request, callback) 
{

	validateId(request, function(error, id) 
	{
		if (error) {
			return end(callback, error, null);
		}

		var table = route.model.table;
		var force = request.query && request.query.force === 'true';

		if (route.isByExtension()) 
		{
			//  "/organizations/1/attributes/10" to "/organizations/1/attributes"
			let url = request.path.replace(new RegExp(`/${id}$`), '');
			//  "/organizations/1/attributes" to "organization"
			let prefix = route.model.table.slice(0, -1);
			//  "/organizations/1/attributes" to "attributes"
			let sufix = url.substring(url.lastIndexOf("/") + 1);
			// "organization_attributes"
			table = `${prefix}_${sufix}`;
		}

		database.query(makeQuery(table, force ? false : route.model.deleteByDisable, id), function(error, results) 
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