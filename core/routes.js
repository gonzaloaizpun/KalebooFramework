"use strict";

var Route = require('./route.js');

class Routes
{
	constructor(model, logger) 
	{
		this.model = model;
		this.logger = logger;
		this.items = [];
	}

	list() 
	{
		var routes = this;

	    routes.items.push(routes.listing());
	    routes.items.push(routes.byId());
	    routes.items.push(routes.new());
	    routes.items.push(routes.delete());
	    routes.items.push(routes.modify());

	    // types (1:1 extensions)
	    if (Array.isArray(routes.model.hasOne)) 
	    {
	    	routes.model.hasOne.forEach(function (element) 
	    	{
				routes.items.push(routes.type(element));
	    	});
	    }

		// Debug
		routes.logger.routes(routes.items);

		// Bye!
	    return routes.items;
	}

		listing() {
			return new Route(Route.http.get, `/${this.model.table}`);
		}

		byId() {
			return new Route(Route.http.get, `/${this.model.table}/:id`);
		}

		new() {
			return new Route(Route.http.post, `/${this.model.table}`);
		}

		delete() {
			return new Route(Route.http.delete, `/${this.model.table}/:id`);
		}

		modify() {
			return new Route(Route.http.put, `/${this.model.table}/:id`);
		}

		type(element) {
			var prefix = this.model.table.slice(0, -1) + '_';
				element = element.replace(prefix, '');
			return new Route(Route.http.get, `/${this.model.table}/${element}`);
		}
}

module.exports = Routes;