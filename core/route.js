"use strict";

const http = {
    get: 1,
    post: 2,
    delete: 3,
    put: 4
};


class Route
{
	constructor(method, url) 
	{
		this.method = method;
		this.url = url;
	}
}

Route.http = http;

module.exports = Route;