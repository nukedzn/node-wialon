
'use strict';

var debug = require( 'debug' )( 'wialon' );
var apis  = require( './apis' );

/**
*   Wialon Remote API wrapper class
*
*   @constructor
*   @param {object} opts - Constructor options
*/
var W = function ( opts ) {
	this._session = {};

	this.options( opts );
	this.bindAPIs( apis );
};


/**
*   Set options
*
*   @param {object} opts - Options
*/
W.prototype.options = function ( opts ) {
	this._options = opts || {};
};


/**
*   Bind API endpoints
*
*   @private
*/
W.prototype.bindAPIs = function ( apis ) {
	for ( var api in apis ) {
		this[api] = apis[api].bind( this );
	}
};


module.exports = W;

