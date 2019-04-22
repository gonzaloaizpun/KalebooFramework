"use strict";

var mysql = require('mysql');
var connection = null;

class Database
{
	constructor(db_config) 
	{
		this.db_config = db_config;
		connection = mysql.createConnection(this.db_config);
	}
	
	query(query, fn) {
		connection.query(query, fn);
	}
}

module.exports = Database;