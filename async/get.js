"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');
var Table = require('../core/table.js');


var main = function(route, db_config, request, callback) 
{
	let id = request.params.id || 0;

	// Is it an integer?
	// ==============================================
	if ((route.isById() || route.isByExtension()) && isNaN(id)) {
		return end(callback, new KalebooError(`Mmm... it looks like ${id} is not an integer`), null);
	}

	// The Main and Basic Query for Listing and getById
	// ==============================================
	var query = `SELECT * FROM ${route.model.table}`;

	if (route.isById()) {
		query = query + ` WHERE id=${id}`;
	}


	// Modify the query when the request is looking for types instead of a model (ex. /users/roles)
	// ==============================================
	if (route.isByType()) {
		query = 'SELECT * FROM ' + Table.type(route.model.table, route.url);
	}


	// Modify the query when the request is looking for extensions instead of a model (ex. /users/1/attributes)
	// ==============================================
	if (route.isByExtension()) 
	{
		let table = Table.reverseExtension(route.model.table, route.url);
		let key   = Table.idKey(route.model.table);

			query = `SELECT * FROM ${table} WHERE ${key} = ${id}`;
	}

	// Get the main and basic data
	// ==============================================
	mysql.createConnection(db_config).query(query, function(error, results) 
	{
		// Exit if there is not any kind of relationship
		// ==============================================
		if (!route.model.hasOne.length && !route.model.hasMany.length && !route.model.hasExternal.length) {
			return end(callback, error, results);
		}

		if (!results.length) {
			return end(callback, new KalebooError(`Mmm... it looks like ${id} does not exists`), null);
		}

		// Getting by id
		if (route.isByListing()) {
			return listFunction(results, db_config, route, callback);
		} else if (route.isById()) {
			return classFunction(results[0], db_config, route, callback);
		} else {
			return end(callback, error, results);
		}

	});
}

	var listFunction = function(results, db_config, route, callback) 
	{
	    var functions = [];
	    for (var i = 0; i < results.length; i++) {
	        functions.push(Async.apply(classFunction, results[i], db_config, route));
	    }

	    Async.parallel(functions, function(error, results) {
	        end(callback, error, results);
	    });
	}

	var classFunction = function(item, db_config, route, callback)
	{
		// Init functions to be executed by Async
		// ==============================================
		var functions = [Async.apply(init, item)];

		// hasOne relationship
		// ==============================================
		if (route.model.hasOne.length > 0) {
			for (var i = 0; i < route.model.hasOne.length; i++) {
				functions.push(hasOneFunction(route.model.hasOne[i], route, db_config, item));
			}
		}

		// hasMany relationships
		// ==============================================
		if (route.model.hasMany.length > 0) {
			for (var i = 0; i < route.model.hasMany.length; i++) {
				functions.push(hasManyFunction(route.model.hasMany[i], route, db_config, item));
			}
		}

		// hasExternal relationship
		// ==============================================
		if (route.model.hasExternal.length > 0) {
			for (var i = 0; i < route.model.hasExternal.length; i++) {
				functions.push(hasExternalFunction(route.model.hasExternal[i], route, db_config, item));
			}
		}

	    Async.waterfall(functions, (error, result) => end(callback, error, result));
	}


		var hasOneFunction = function (relatedTable, route, db_config, item) 
		{
			// scenario: requesting /silobags which have a relationship with the table silobag_types

			let relationshipKey = Table.idKey(relatedTable);										// id_silobag_type
			let attributeKey = relationshipKey.substring(relationshipKey.lastIndexOf('_') + 1);		// type

			let idWhere = item[relationshipKey];
			let keyWhere = 'id';

			delete item[relationshipKey];

			return Async.apply(query, db_config, keyWhere, idWhere, relatedTable, attributeKey, true);
		}

		var hasExternalFunction = function (relatedTable, route, db_config, item) 
		{
			// scenario: requesting /measurements which have metrics, devices, units....

			let relationshipKey = Table.idKey(relatedTable);	// id_metric
			let attributeKey = Table.singular(relatedTable);	// metric

			let idWhere = item[relationshipKey];
			let keyWhere = 'id';

			delete item[relationshipKey];

			return Async.apply(query, db_config, keyWhere, idWhere, relatedTable, attributeKey, true);
		}

		var hasManyFunction = function (relatedTable, route, db_config, item)
		{
			// scenario: requestin /organizations/1 which have organization_attributes, organization_products...

			let attributeKey = Table.extension(relatedTable);
			let idWhere = item.id;
			let keyWhere = Table.idKey(route.model.table);

			return Async.apply(extendedQuery, db_config, keyWhere, idWhere, relatedTable, attributeKey, false);
		}

			var query = function(db_config, keyWhere, idWhere, table, attributeKey, onlyOneItem, queue, callback)
			{
				let query = `SELECT * FROM ${table} WHERE ${keyWhere} = ${idWhere}`;

				mysql.createConnection(db_config).query(query, function(error, results) {
					if (onlyOneItem) {
						queue[attributeKey] = results[0];
					} else {
						queue[attributeKey] = results;
					}
					callback(null, queue);
				});
			}

			var extendedQuery = function(db_config, keyWhere, idWhere, table, attributeKey, onlyOneItem, queue, callback)
			{
				let query = `SELECT * FROM ${table} WHERE ${keyWhere} = ${idWhere}`;

				mysql.createConnection(db_config).query(query, function(error, results) {
					if (onlyOneItem) {
						queue[attributeKey] = results[0];
					} else {
						queue[attributeKey] = results;
					}
					callback(null, queue);
				});
			}


var end = function(callback, error, results) {
    return callback(error, results);
}


var init = function (item, callback) {
	callback(null, item);
}

module.exports = main;