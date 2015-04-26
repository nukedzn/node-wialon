
'use strict';

/**
*   Wialon Remote API endpoint implementations
*
*   @module apis
*/


/**
*   Helper method to inject module endpoint implementations
*
*   @private
*   @param {string} module - Relative module path
*/
var inject = function ( module ) {
	return function ( opts ) {
		var C = require( module );
		var o = new C( opts );
		o.wialon = this;
		return Object.freeze( o );
	};
};


/**
*   Export APIs
*/
module.exports = {
	session : inject( './core/session' ),
	search  : inject( './core/search' )
};

