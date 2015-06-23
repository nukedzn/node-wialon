
'use strict';

/**
*   Node.js wrapper module for Wialon Remote API
*   @module wialon
*/

var Wialon = require( './lib/wialon' );

module.exports = function ( opts ) {
	return new Wialon( opts );
};

