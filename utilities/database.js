"use strict";

var mysql = require('mysql');
var connection = null;

class Database
{
	constructor(db_config) 
	{
		this.db_config = db_config;
		connection = mysql.createConnection(this.db_config);
		connection.connect();
		connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
			if (error) {
				console.log('ERROR: Cannot connect database.');
				console.log('\nBye!');
				process.exit(-1);
			}
		});
	}
	
	query(query, fn) {
		connection.query(query, fn);
	}
}

module.exports = Database;