
'use strict';

var debug  = require( 'debug' )( 'core/search' );
var extend = require( 'extend' );

var Search = function ( opts ) {
	this.options( opts );

	this._params = {
		spec : {
			propName : 'sys_name',
			propValueMask : '*',
			sortType : 'sys_name',
			propType : 'property'
		},
		force : 0,
		flags : 0x00,
		from  : 0,
		to    : 0
	};
};


Search.prototype.options = function ( opts ) {
	this._options = opts || {};
};


Search.prototype.search = function ( type, filter, flags, callback, force ) {

	var params = {
		spec : {
			itemsType : type,
			propValueMask : filter
		},
		force : force,
		flags : flags
	};


	this._search( params, callback );

};


Search.prototype.units = function ( filter, callback ) {

	var params = {
		spec : {
			itemsType : 'avl_unit',
			propValueMask : filter
		},
		flags : 0x00000001
	};

	this._search( params, callback );

};


Search.prototype.geofences = function ( filter, callback ) {

	var params = {
		spec : {
			itemsType : 'avl_resource',
			propValueMask : filter
		},
		flags : 0x00001001
	};

	this._search( params, callback );

};


Search.prototype.retranslators = function ( filter, callback ) {

	var params = {
		spec : {
			itemsType : 'avl_retranslator',
			propValueMask : filter
		},
		flags : 0x00000301
	};

	this._search( params, callback );

};


Search.prototype.dummycb = function ( err, data ) {};


Search.prototype._search = function ( params, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	var _params = this._params;
	var params  = extend( true, _params, params );
	debug( params );

	var session = this.wialon.session();
	session.request( 'core/search_items', params, function ( err, data ) {
		if ( err ) {
			return callback( err );
		}

		callback( err, data.items );
	} );

}


module.exports = Search;

