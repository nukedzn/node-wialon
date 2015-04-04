
'use strict';

var debug = require( 'debug' )( 'core/search' );

var Search = function ( opts ) {
	this.options( opts );
};


Search.prototype.options = function ( opts ) {
	this._options = opts || {};
};


Search.prototype.search = function ( type, filter, flags, callback, force ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	var force  = force || 0;
	var params = {
		"spec": {
			"itemsType"     : type,
			"propName"      : "sys_name",
			"propValueMask" : filter,
			"sortType"      : "sys_name",
			"propType"      : "property"
		},
		"force" : force,
		"flags" : flags,
		"from"  : 0,
		"to"    : 0
	};

	var session = this.wialon.session();
	session.request( 'core/search_items', params, function ( err, data ) {
		if ( err ) {
			return callback( err );
		}

		callback( err, data.items );
	} );

};


Search.prototype.dummycb = function ( err, data ) {};


module.exports = Search;

