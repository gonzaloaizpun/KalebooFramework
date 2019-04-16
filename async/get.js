"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('../utilities/error.js');


var main = function(route, id, db_config, callback) 
{
	// Mode? ById or List?
	// ==============================================
	let isList = (id == null || id == 0);

	// Is it an integer?
	// ==============================================
	if (!isList && isNaN(id)) {
		return end(callback, new KalebooError(`Mmm... it looks like ${id} is not an integer`), null);
	}

	// The Main and Basic Query
	// ==============================================
	let connection 	= mysql.createConnection(db_config);
	var query 		= `SELECT * FROM ${route.model.table}`;

	if (!isList) {
		query = query + ` WHERE id=${id}`;
	}

	// Get the main and basic data
	// ==============================================
	connection.query(query, function(error, results) 
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
		if (isList) {
			return listFunction(results, db_config, route, callback);
		} else {
			return classFunction(results[0], db_config, route, callback);
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
			let relationshipKey = 'id_' + relatedTable.slice(0, -1);
			let attributeKey = relationshipKey.replace('id_' + route.model.table.slice(0, -1) + '_', '');
			let idWhere = item[relationshipKey];
			let keyWhere = 'id';

			delete item[relationshipKey];

			return Async.apply(query, db_config, keyWhere, idWhere, relatedTable, attributeKey, true);
		}

		var hasExternalFunction = function (relatedTable, route, db_config, item) 
		{
			let relationshipKey = 'id_' + relatedTable.slice(0, -1);
			let attributeKey = relatedTable.slice(0, -1);
			let idWhere = item[relationshipKey];
			let keyWhere = 'id';

			delete item[relationshipKey];

			return Async.apply(query, db_config, keyWhere, idWhere, relatedTable, attributeKey, true);
		}

		var hasManyFunction = function (relatedTable, route, db_config, item)
		{
			let attributeKey = relatedTable.substring(relatedTable.indexOf("_") + 1);
			let idWhere = item.id;
			let keyWhere = 'id_' + relatedTable.substring(0, relatedTable.indexOf("_"));

			return Async.apply(extendedQuery, db_config, keyWhere, idWhere, relatedTable, attributeKey, false);
		}

			var query = function(db_config, keyWhere, idWhere, table, attributeKey, onlyOneItem, queue, callback)
			{
				let connection 	= mysql.createConnection(db_config);
				let query = `SELECT * FROM ${table} WHERE ${keyWhere} = ${idWhere}`;

				connection.query(query, function(error, results) {
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
				let connection 	= mysql.createConnection(db_config);
				let query = `SELECT * FROM ${table} WHERE ${keyWhere} = ${idWhere}`;

				connection.query(query, function(error, results) {
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