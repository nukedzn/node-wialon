
'use strict';

var debug  = require( 'debug' )( 'wialon:core:search' );
var extend = require( 'extend' );


/**
*   Convenience class to simplify search commands
*
*   @constructor
*   @param {object} opts - Constructor options
*/
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


/**
*   Set options
*
*   @param {object} opts - Options
*/
Search.prototype.options = function ( opts ) {
	this._options = opts || {};
};


/**
*   Search items by property using 'core/search_items' command
*
*   @param {string} type   - Item type (itemsType)
*   @param {string} filter - Property search filter (propValueMask)
*   @param {number} flags  - Search flags
*   @param {callback} callback - Callback method to handle the response
*   @param {number=} force - Force a search (0 - if such search has been done,
*          then return cached result, 1 - to do a new search )
*   @see {@link http://sdk.wialon.com/wiki/en/kit/remoteapi/apiref/core/search_items}
*/
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


/**
*   Search for units using 'avl_unit' item type
*
*   @param {string} filter     - Search filter
*   @param {callback} callback - Callback method to handle the response
*/
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


/**
*   Search for zones using 'avl_resource' item type. Flags are set
*   to 0x00001001.
*
*   @param {string} filter     - Search filter
*   @param {callback} callback - Callback method to handle the response
*/
Search.prototype.zones = function ( filter, callback ) {

	var params = {
		spec : {
			itemsType : 'avl_resource',
			propValueMask : filter
		},
		flags : 0x00001001
	};

	this._search( params, callback );

};


/**
*   Alias for {@link Search#zones}
*
*   @method
*   @see Search#zones
*/
Search.prototype.geofences = Search.prototype.zones;


/**
*   Search for retranslators using 'avl_retranslator' item type. Flags are
*   set to 0x00000301.
*
*   @param {string} filter     - Search filter
*   @param {callback} callback - Callback method to handle the response
*/
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


/**
*   Internal callback method
*
*   @private
*/
Search.prototype.dummycb = function ( err, data ) {};


/**
*   Internal search helper
*
*   @private
*   @param {object} params - Search parameters
*   @param {callback} callback - Callback method to handle the response
*/
Search.prototype._search = function ( params, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	var _params = this._params;
	params = extend( true, _params, params );
	debug( params );

	var session = this.wialon.session;
	session.request( 'core/search_items', params, function ( err, data ) {
		if ( err ) {
			return callback( err );
		}

		callback( err, data.items );
	} );

};


module.exports = Search;

