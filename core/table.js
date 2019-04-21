"use strict";

var pluralize = require('pluralize');

class Table 
{
	plural(table) {
		return pluralize(table);
	}

	singular(table) {
		return pluralize.singular(table);
	}

	extension(table) {
		// from `user_permissions` 		to: `permissions`
		// ==============================================
		return table.substring(table.indexOf('_') + 1);
	}

	reverseExtension(model, url) 
	{
		// from: `/user/1/attributes` 	to: `user_attributes`
		// ==============================================
		let prefix = this.singular(model);						// 'users' to 'user' 
		let sufix  = url.substring(url.lastIndexOf('/') + 1);	// '/user/1/attributes' to 'attributes'
		return `${prefix}_${sufix}`;
	}

	reverseExtension(model, url, id) 
	{
		//  from: `/organizations/1/attributes/10` 	to: `organization_attributes`
		// ==============================================
		let prefix = this.singular(model);						// 'organizations' to 'organization'
		url = url.replace(`/${id}`, '');						// '/organizations/1/attributes/10' to '/organizations/1/attributes'
		let sufix = url.substring(url.lastIndexOf("/") + 1);	// '/organizations/1/attributes' to 'attributes'
		return `${prefix}_${sufix}`;
	}

	type(model, url) 
	{
		let prefix = this.singular(model);
		let sufix  = url.substring(url.lastIndexOf('/') + 1);
		return `${prefix}_${sufix}`; 
	}

	idKey(table) {
		return 'id_' + this.singular(table);
	}
}

module.exports = new Table();