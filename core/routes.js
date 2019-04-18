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


	    // 01 - List for 1:1 dependencies like /devices with /device_brands (GET /device/brands)
	    if (Array.isArray(routes.model.hasOne)) {
	    	routes.model.hasOne.forEach(function (element) {
				routes.items.push(routes.type(element));
	    	});
	    }

	    // 02 - Post for 1:N relationships like /users with /user_attributes (GET /user/:id/attributes)
	    if (Array.isArray(routes.model.hasMany)) 
	    {
	    	routes.model.hasMany.forEach(function (element) 
	    	{
				routes.items.push(routes.extension(element, Route.http.get));
				routes.items.push(routes.extension(element, Route.http.post));
				routes.items.push(routes.extension(element, Route.http.delete));

				// TODO: in the future we need to make a decision about to make everything editable or not.
				// by the moment, only those tables with "attributes" will be editable.-
				if (element.indexOf('_attributes') > -1) {
					routes.items.push(routes.extension(element, Route.http.put));
				}
	    	});
	    }

	    // Then, dynamic urls like /users/:id
	    routes.items.push(routes.listing());
	    routes.items.push(routes.byId());
	    routes.items.push(routes.new());
	    routes.items.push(routes.delete());

	    if (routes.model.isEditable) {
	    	routes.items.push(routes.modify());
	    }

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

		extension(element, method) 
		{
			var prefix = this.model.table.slice(0, -1) + '_';
				element = element.replace(prefix, '');

			var url = `/${this.model.table}/:id/${element}`;

			if (method == Route.http.delete || method == Route.http.put) {
				url = `/${this.model.table}/:id/${element}/:id`;
			}

			return new Route(method, url, this.model, Route.context.extension);
		}
}

module.exports = Routes;