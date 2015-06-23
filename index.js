
'use strict';

/**
*   Node.js wrapper module for Wialon Remote API
*   @module wialon
*/


var Wialon = require( './lib/wialon' );

/**
*   Initialise a new API instance
*
*   @param {object} opts - Options
*/
module.exports = function ( opts ) {
	return new Wialon( opts );
};

