"use strict";

var Async = require('async');
var mysql = require('mysql');
var KalebooError = require('./error.js');


var main = function(model, relationships, extensions, db, id, callback) 
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
	let connection 	= mysql.createConnection(db);
	var query 		= `SELECT * FROM ${model}`;

	if (!isList) {
		query = query + ` WHERE id=${id}`;
	}

	// Get the main and basic data
	// ==============================================
	connection.query(query, function(error, results) 
	{
		// Exit if there is not relationship
		// ==============================================
		if (relationships === undefined && extensions === undefined) {
			return end(callback, error, results);
		}

		// Getting by id
		if (isList) {
			return listFunction(results, relationships, extensions, db, model, callback);
		} else {
			return classFunction(results[0], relationships, extensions, db, model, callback);
		}

	});
}

var listFunction = function(results, relationships, extensions, db, model, callback) 
{
    var functions = [];
    for (var i = 0; i < results.length; i++) {
        functions.push(Async.apply(classFunction, results[i], relationships, extensions, db, model));
    }

    Async.parallel(functions, function(error, results) {
        end(callback, error, results);
    });
}

var classFunction = function(item, relationships, extensions, db, model, callback)
{
	// Init functions to be executed by Async
	// ==============================================
	var functions = [Async.apply(init, item)];


	// There is a few relationships... (ex. organization has a user)
	// ==============================================
	if (relationships !== undefined) {
		for (var i = 0; i < relationships.length; i++) {
			functions.push(relationshipFunction(relationships[i], db, item));
		}
	}


	// There is a few extensions... (ex. organization has organization_attributes)
	// ==============================================
	if (extensions !== undefined) {
		for (var i = 0; i < extensions.length; i++) {
			functions.push(extensionFunction(extensions[i], model, db, item.id));
		}
	}

    Async.waterfall(functions, (error, result) => end(callback, error, result));
}

var extensionFunction = function (extension, model, db, id) 
{
	let newModel = model.slice(0, -1) + '_' + extension;
	let keyindex = 'id_' + model.slice(0, -1);
	return Async.apply(asyncFunction, db, keyindex, id, newModel, extension);	
}

var relationshipFunction = function (relationship, db, item)
{
	let newModel 	= relationship;
	let relation 	= 'id_' + newModel.slice(0, -1);
	return Async.apply(asyncFunction, db, 'id', item[relation], newModel, relationship);
}

var asyncFunction = function(db, keyindex, id, model, attributeKey, enqueuedResult, callback)
{
	let connection 	= mysql.createConnection(db);
	let query = `SELECT * FROM ${model} WHERE ${keyindex} = ${id}`;

	connection.query(query, function(error, results) {
		enqueuedResult[attributeKey] = results;
		callback(null, enqueuedResult);
	});
}

var end = function(callback, error, enqueuedResult) {
    return callback(error, enqueuedResult);
}

var init = function (item, callback) {
	callback(null, item);
}

module.exports = main;