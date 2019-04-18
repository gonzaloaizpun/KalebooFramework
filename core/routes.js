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


	    // First place: fixed urls like /users/types (1:1 extensions)
	    if (Array.isArray(routes.model.hasOne)) {
	    	routes.model.hasOne.forEach(function (element) {
				routes.items.push(routes.type(element));
	    	});
	    }

	    // Then, dynamic urls like /users/:id
	    routes.items.push(routes.listing());
	    routes.items.push(routes.byId());
	    routes.items.push(routes.new());
	    routes.items.push(routes.delete());
	    routes.items.push(routes.modify());

		// Debug
		routes.logger.routes(routes.items);

		// Bye!
	    return routes.items;
	}

		listing() {
			return new Route(Route.http.get, `/${this.model.table}`, this.model, Route.context.listing);
		}

		byId() {
			return new Route(Route.http.get, `/${this.model.table}/:id`, this.model, Route.context.byId);
		}

		new() {
			return new Route(Route.http.post, `/${this.model.table}`, this.model, Route.context.new);
		}

		delete() {
			return new Route(Route.http.delete, `/${this.model.table}/:id`, this.model, Route.context.delete);
		}

		modify() {
			return new Route(Route.http.put, `/${this.model.table}/:id`, this.model, Route.context.modify);
		}

		type(element) {
			var prefix = this.model.table.slice(0, -1) + '_';
				element = element.replace(prefix, '');
			return new Route(Route.http.get, `/${this.model.table}/${element}`, this.model, Route.context.type);
		}
}

module.exports = Routes;