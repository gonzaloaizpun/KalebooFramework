"use strict";

var KalebooError = require('../../utilities/error.js');

var main = function(request, callback) 
{
    let id = request.params.id || 0;

    if (id == 0) {
    	let error = new KalebooError(`Mmm... it looks like 'id' property do not exists in the request`);
    	return callback(error, null);
    }

    if (isNaN(id)) {
    	let error = new KalebooError(`Mmm... it looks like ${id} is not a valid id`);
    	return callback(error, null);
    }

    // green light
    return callback(null, id);
}

module.exports = main;