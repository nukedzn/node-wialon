
'use strict';

var debug = require( 'debug' )( 'wialon' );
var apis  = require( './apis' );

var W = function ( opts ) {
	this._session = {};

	this.options( opts );
	this.bindAPIs( apis );
};


W.prototype.options = function ( opts ) {
	this._options = opts || {};
};


W.prototype.bindAPIs = function ( apis ) {
	for ( var api in apis ) {
		this[api] = apis[api].bind( this );
	}
};


var wialon = new W();

module.exports = wialon;

