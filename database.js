"use strict";

var mysql      = require('mysql');
var connection = mysql.createConnection(config);

class Database
{
	configuration : {},
	
	query(query, fn) {
		connection.query(query, fn);
	}
}

module.exports = new Database;