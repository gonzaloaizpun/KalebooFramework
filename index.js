"use strict";

var mysql  = require('mysql');
var async  = require('./async.js');
var Logger = require('./logger.js');

class Kaleboo
{
	constructor(db_config) 
	{
		Logger.Hello();

		this.models = [];
		this.relationships = {};
		this.extensions = {};
		this.db_config = null;
	}

    database(config) {
    	this.db_config = config;
    }

    asyncHandle(model, relationships, extensions, db)
    {
	    return function(request, response, next) 
	    {
	    	let id = request.params.id || 0;

	    	async(model, relationships, extensions, db, id, function(error, results) 
	    	{
	    		if (error != null) {
	    			response.status(404).json({ message : error.message });
	    		} else if (results.length == 1) {
					response.send(results[0]);
	    		} else {
	    			response.send(results);
	    		}
	    	});
	    };
	}

    routes(app)
    {
    	for (var i = 0; i < this.models.length; i++) 
    	{
    		app.get(`/${this.models[i]}`, this.asyncHandle(this.models[i], this.relationships[this.models[i]], this.extensions[this.models[i]], this.db_config));
    		app.get(`/${this.models[i]}/:id`, this.asyncHandle(this.models[i], this.relationships[this.models[i]], this.extensions[this.models[i]], this.db_config));

    		Logger.ExpressGetRoute(`/${this.models[i]}`);
    		Logger.ExpressGetRoute(`/${this.models[i]}/:id`);
    	}
    }

    model(model) 
    {
    	Logger.NewModel(model);
        this.models.push(model);
        return this;
    }

    with(models) 
    {
    	if (!Array.isArray(models)) {
    		models = [models];
    	}
    	this.relationships[this.models[this.models.length -1]] = models;
    	return this;
    }

    has(models) 
    {
    	if (!Array.isArray(models)) {
    		models = [models];
    	}
    	this.extensions[this.models[this.models.length -1]] = models;
    	return this;
    }

    verbose(option) {
        Logger.Verbose(option);
    }
}


module.exports = new Kaleboo();
