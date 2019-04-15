"use strict";

var async        = require('../async.js');
var Logger       = require('../utilities/logger.js');
var Autodiscover = require('./autodiscover.js');
var Route        = require('./route.js');

class Kaleboo
{
	constructor() 
	{
		this.models = [];
		this.relationships = {};
		this.extensions = {};
		this.db_config = null;
        this.express = null;
	}

    automatically(db_config, server_config, express) 
    {
        // keep the configs
    	this.db_config = db_config;
        this.express   = express;

        // Run the Autodiscover
        var autodiscover = new Autodiscover(this.db_config, Logger);
            
            autodiscover.run(function (error, results) 
            {
                // Great! Now we have Models and Routes as classes

                // Assign the express routes
                var dummyFunction = function (request, response) {
                    response.send({ fullname : 'Jhon Doe' });
                }

                results.routes.forEach(function(model) 
                {
                    model.forEach(function(route) 
                    {
                        if (route.method == Route.http.get) {
                            express.get(route.url, dummyFunction);
                        } else if (route.method == Route.http.post) {
                            express.post(route.url, dummyFunction);
                        } else if (route.method == Route.http.put) {
                            express.put(route.url, dummyFunction);
                        } else if (route.method == Route.http.delete) {
                            express.delete(route.url, dummyFunction);
                        }
                    });
                });

               express.listen(server_config.Port, () => Logger.serverStarted(server_config.Port));
            });
    }

    verbose(option) 
    {
        Logger.enabled(option);
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

}


module.exports = new Kaleboo();
