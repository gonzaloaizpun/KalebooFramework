"use strict";

var KalebooError = require('../../utilities/error.js');

var main = function(route, body, requireAll, callback) 
{
	// Vars
	var inputs = Object.keys(body);
	var errorObject = null;


	// (01) - checking if the body has at least 1 attribute
	// ==============================================

	if (!inputs.length && route.model.filleable.length > 0) {
		errorObject = new KalebooError(`Mmm... there is no input(s). Did you forget to attach them in the request?`);
		return callback(errorObject, null);
	}


	// (02) - checking if the body has valid filleable attributes with a proper type
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
			return callback(errorObject, null);
		}


	// (03) - checking if all filleable attributes exists in the request
	// ==============================================

	if (requireAll) 
	{
		route.model.filleable.forEach(function(key) 
		{
			if (inputs.indexOf(key) == -1) {
				errorObject = new KalebooError(`Mmm... we need ${key} in order to proccess your request. Did you forget it?`);
				return;
			}
		});

			// bye?
			if (errorObject) {
				return callback(errorObject, null);
			}

	}

	// green light!
	return callback(null, null);
}


module.exports = main;