"use strict";

const http = {
    get: 1,
    post: 2,
    delete: 3,
    put: 4
};


class Route
{
	constructor(method, url, model) 
	{
		this.method = method;
		this.url = url;
		this.model = model;
	}
}

Route.http = http;

module.exports = Route;