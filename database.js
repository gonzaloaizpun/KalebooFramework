"use strict";

var mysql = require('mysql');

class Database
{
	constructor(db_config) {
		this.db_config = db_config;
	}
	
	query(query, fn) {
		var connection = mysql.createConnection(this.db_config);
			connection.query(query, fn);
	}
}

module.exports = Database;