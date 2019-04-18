"use strict";

const http = {
    get: 1,
    post: 2,
    delete: 3,
    put: 4
};

const context = {
       byId: 1,
    listing: 2,
       type: 3,
        new: 4,
     modify: 5,
     delete: 6
};


class Route
{
	constructor(method, url, model, type) 
	{
		this.method = method;
		this.url = url;
		this.model = model;
		this.type = type;
	}

	isByListing() {
		return this.type == context.listing;
	}

	isById() {
		return this.type == context.byId;
	}

	isByType() {
		return this.type == context.type;
	}
}

Route.http = http;
Route.context = context;

module.exports = Route;