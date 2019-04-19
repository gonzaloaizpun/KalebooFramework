"use strict";

var Logger       = require('../utilities/logger.js');
var Autodiscover = require('./autodiscover.js');
var Route        = require('./route.js');
var asyncGet     = require('../async/get.js');
var asyncPost    = require('../async/post.js');
var asyncDelete  = require('../async/delete.js');
var asyncPut     = require('../async/put.js');
var asyncPostExtension = require('../async/postExtension.js');

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

        var kaleboo = this;

        // Run the Autodiscover
        var autodiscover = new Autodiscover(this.db_config, Logger);
            
            autodiscover.run(function (error, results) 
            {
                // Great! Now we have Models! and Routes! as classes
                results.routes.forEach(function(routes) 
                {
                    routes.forEach(function(route) 
                    {
                        // Assign the express routes
                        switch(route.method) 
                        {
                            case Route.http.get:

                                express.get(route.url, kaleboo.getHandler(route, db_config));
                                break;

                            case Route.http.post:
                                if (route.isByExtension()) {
                                    express.post(route.url, kaleboo.postExtensionHandler(route, db_config));
                                } else {
                                    express.post(route.url, kaleboo.postHandler(route, db_config));
                                }
                                break;

                            case Route.http.put:
                                express.put(route.url, kaleboo.putHandler(route, db_config));
                                break;

                            case Route.http.delete:
                                express.delete(route.url, kaleboo.deleteHandler(route, db_config));
                                break;
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

    getHandler(route, db_config)
    {
	    return function(request, response, next) 
	    {
	    	asyncGet(route, db_config, request, function(error, results) 
	    	{
	    		if (error != null) {
	    			response.status(404).json({ message : error.message });
	    		} else if (results.length == 1 && !route.isByListing()) {
					response.send(results[0]);
	    		} else {
	    			response.send(results);
	    		}
	    	});
	    };
	}

    postHandler(route, db_config)
    {
        return function(request, response, next) 
        {
            asyncPost(route, db_config, request, function(error, results) 
            {
                if (error != null) {
                    response.status(404).json({ message : error.message });
                } else {
                    response.send(results);
                }
            });
        };
    }

    postExtensionHandler(route, db_config)
    {
        return function(request, response, next) 
        {
            asyncPostExtension(route, db_config, request, function(error, results) 
            {
                if (error != null) {
                    response.status(404).json({ message : error.message });
                } else {
                    response.send(results);
                }
            });
        };
    }

    deleteHandler(route, db_config)
    {
        return function(request, response, next) 
        {
            asyncDelete(route, db_config, request, function(error, results) 
            {
                if (error != null) {
                    response.status(404).json({ message : error.message });
                } else {
                    response.send(results);
                }
            });
        };
    }

    putHandler(route, db_config)
    {
        return function(request, response, next) 
        {
            asyncPut(route, db_config, request, function(error, results) 
            {
                if (error != null) {
                    response.status(404).json({ message : error.message });
                } else {
                    response.send(results);
                }
            });
        };
    }

}


module.exports = new Kaleboo();
