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
		// Exit if there is not relationship
		// ==============================================
		var relationships = undefined;
		var extensions = undefined;

		if (relationships === undefined && extensions === undefined) {
			return end(callback, error, results);
		}

		// Getting by id
		if (isList) {
			return listFunction(results, relationships, extensions, db_config, route, callback);
		} else {
			return classFunction(results[0], relationships, extensions, db_config, route, callback);
		}

	});
}

var listFunction = function(results, relationships, extensions, db_config, route, callback) 
{
    var functions = [];
    for (var i = 0; i < results.length; i++) {
        functions.push(Async.apply(classFunction, results[i], relationships, extensions, db_config, route));
    }

    Async.parallel(functions, function(error, results) {
        end(callback, error, results);
    });
}

var classFunction = function(item, relationships, extensions, db_config, route, callback)
{
	// Init functions to be executed by Async
	// ==============================================
	var functions = [Async.apply(init, item)];


	// There is a few relationships... (ex. organization has a user)
	// ==============================================
	if (relationships !== undefined) {
		for (var i = 0; i < relationships.length; i++) {
			functions.push(relationshipFunction(relationships[i], db_config, item));
		}
	}


	// There is a few extensions... (ex. organization has organization_attributes)
	// ==============================================
	if (extensions !== undefined) {
		for (var i = 0; i < extensions.length; i++) {
			functions.push(extensionFunction(extensions[i], route, db_config, item.id));
		}
	}

    Async.waterfall(functions, (error, result) => end(callback, error, result));
}

var extensionFunction = function (extension, route, db_config, id) 
{
	let newModel = route.model.table.slice(0, -1) + '_' + extension;
	let keyindex = 'id_' + route.model.table.slice(0, -1);
	return Async.apply(asyncFunction, db_config, keyindex, id, newModel, extension);	
}

var relationshipFunction = function (relationship, db_config, item)
{
	let newModel 	= relationship;
	let relation 	= 'id_' + newModel.slice(0, -1);
	return Async.apply(asyncFunction, db_config, 'id', item[relation], newModel, relationship);
}

var asyncFunction = function(db_config, keyindex, id, table, attributeKey, queue, callback)
{
	let connection 	= mysql.createConnection(db_config);
	let query = `SELECT * FROM ${table} WHERE ${keyindex} = ${id}`;

	connection.query(query, function(error, results) {
		queue[attributeKey] = results;
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