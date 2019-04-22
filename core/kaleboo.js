"use strict";

var Logger       = require('../utilities/logger.js');
var Autodiscover = require('./autodiscover.js');
var Route        = require('./route.js');
var Database     = require('../utilities/database.js');

var asyncGet     = require('../async/get.js');
var asyncPost    = require('../async/post.js');
var asyncDelete  = require('../async/delete.js');
var asyncPut     = require('../async/put.js');
var asyncPostExtension = require('../async/postExtension.js');
var asyncPutExtension = require('../async/putExtension.js');


class Kaleboo
{
	constructor() 
	{
		this.models = [];
		this.relationships = {};
		this.extensions = {};
		this.db_config = null;
        this.express = null;
        this.database = null;
	}

    automatically(db_config, server_config, express) 
    {
        // keep the configs
    	this.db_config = db_config;
        this.express   = express;
        this.database  = new Database(db_config);

        var kaleboo = this;

        // Run the Autodiscover
        var autodiscover = new Autodiscover(kaleboo.database, Logger);
            
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

                                express.get(route.url, kaleboo.handler(route, kaleboo.database, asyncGet));
                                break;

                            case Route.http.post:
                                if (route.isByExtension()) {
                                    express.post(route.url, kaleboo.handler(route, kaleboo.database, asyncPostExtension));
                                } else {
                                    express.post(route.url, kaleboo.handler(route, kaleboo.database, asyncPost));
                                }
                                break;

                            case Route.http.put:
                                if (route.isByExtension()) {
                                    express.put(route.url, kaleboo.handler(route, kaleboo.database, asyncPutExtension));
                                } else {
                                    express.put(route.url, kaleboo.handler(route, kaleboo.database, asyncPut));
                                }
                                
                                break;

                            case Route.http.delete:
                                express.delete(route.url, kaleboo.handler(route, kaleboo.database, asyncDelete));
                                break;
                        }
                    });
                });

               express.listen(server_config.Port, () => Logger.serverStarted(server_config.Port));
            });
    }

    verbose(option) {
        Logger.enabled(option);
    }

    handler(route, database, action)
    {
        return function(request, response, next) 
        {
            Logger.request(request, route);

            action(route, database, request, function(error, results) 
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

}


module.exports = new Kaleboo();
